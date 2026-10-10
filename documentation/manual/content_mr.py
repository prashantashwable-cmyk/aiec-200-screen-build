"""The AIEC user manual's text, in Marathi. build_manual.py turns it into the PDF.

Every button, tab and message the manual names is taken from the app's own words (U('<screen>:<key>') / Q(...),
read from manual_assets/ui-strings.tsv), so the manual cannot drift from the screens: a missing key stops the build.
Every figure is a genuine screenshot from manual_assets/screenshots (see build_manual.shot).
"""
from __future__ import annotations

import datetime as dt
import json
import re
from pathlib import Path

import build_manual as B

D: B.Doc

# ---------------------------------------------------------------- small helpers

def fill(text: str, params: dict) -> str:
    """The app's {{placeholders}}: the value the screen would show where we know it, else an ellipsis."""
    return re.sub(r'\{\{\s*(\w+)\s*\}\}', lambda m: str(params.get(m.group(1), '…')), text)


def U(key: str, **params) -> str:
    """A label exactly as the app shows it."""
    return f'<span class="ui">{B.esc(fill(B.mr(key), params))}</span>'


def Q(key: str, **params) -> str:
    """A message exactly as the app shows it."""
    return f'«{B.esc(fill(B.mr(key), params))}»'


_MR_VALUES = {v[1] for v in B.STRINGS.values()}


def L(text: str) -> str:
    """A label read off a screenshot; it must be one of the app's own Marathi strings, exactly."""
    if text not in _MR_VALUES:
        raise KeyError(f'not an app label: {text}')
    return f'<span class="ui">{B.esc(text)}</span>'


def P(path: str) -> str:
    return f'<code>{B.esc(path)}</code>'


def F(key: str) -> str:
    return f'[[fig:{key}]]'


def S(anchor: str) -> str:
    return f'[[sec:{anchor}]]'


ROLE = {'admin': 'प्रशासक (Admin)', 'surveyor': 'सर्वेक्षक', 'technician': 'तंत्रज्ञ', 'customer': 'ग्राहक',
        'supplier': 'पुरवठादार', 'public': 'सर्वांसाठी (साइन-इनशिवाय)'}
NAV = lambda k: U(f'common:nav.{k}')  # noqa: E731

TODAY = dt.date(2026, 10, 10)
VERSION = json.loads((B.ROOT / 'package.json').read_text())['version']


def feature(*, title: str, anchor: str, purpose: str, access: str, who: str, prereq: str, steps: list[str],
            figs, fields: list[tuple[str, str]], result: str, errors: list[str], tips: list[str],
            others: list[str] | None = None, after_steps=None):
    """One feature in the manual's nine-part layout."""
    D.h2(title, anchor)
    D.label('१. उद्देश')
    D.p(purpose)
    D.label('२. कसे उघडावे')
    D.facts([('मार्ग', access), ('कोणासाठी', who)])
    D.label('३. आधी काय हवे')
    D.p(prereq)
    D.label('४. कार्यपद्धती')
    D.steps(steps)
    if after_steps:
        after_steps()
    D.label('५. स्क्रीनशॉट')
    figs()
    D.label('६. घटकांचे वर्णन')
    D.table(['घटक', 'काय करतो'], [[a, b] for a, b in fields])
    D.label('७. अपेक्षित परिणाम')
    D.p(result)
    D.label('८. तपासण्या आणि त्रुटी')
    D.ul(errors)
    D.label('९. टिपा आणि मर्यादा')
    D.ul(tips)
    if others:
        others_table(others)


def route_of(sid: str, role: str | None = None) -> dict:
    for r in B.ROUTES:
        if r['id'] == sid and (role is None or role in r['roles']):
            return r
    for r in B.ROUTES:
        if r['id'] == sid:
            return r
    raise KeyError(sid)


def subtitle_of(sid: str) -> str:
    r = route_of(sid)
    ns = (r.get('titleKey') or '').split('.')[0]
    v = B.STRINGS.get(f'{sid}:{ns}.subtitle')
    if v and '{{' not in v[1]:
        return v[1]
    return ''


def gallery_key(s: dict) -> str:
    return 'g-' + s['file'].replace('/', '-').replace('.png', '')


def others_table(ids: list[str]):
    """The module's other screens: what each is for, who opens it, and its screenshot in the appendix gallery."""
    rows = []
    for sid in ids:
        r = route_of(sid)
        shots = [s for s in B.SCREENS if s['id'] == sid and s['viewport'] == 'desktop' and not s['loading']]
        title = B.screen_title(sid) or sid
        roles = ', '.join(ROLE[x] for x in r['roles'])
        refs = ' '.join(F(gallery_key(s)) for s in shots[:2])
        rows.append([sid, B.esc(title), roles, P(r['path']), B.esc(subtitle_of(sid)) or '—', refs or '—'])
    D.h4('या विभागातील इतर स्क्रीन')
    D.table(['क्र.', 'स्क्रीन', 'भूमिका', 'पत्ता', 'हे कशासाठी', 'आकृती'], rows, 'compact')


# ================================================================= cover

def cover() -> str:
    home = B.prep(B.SHOTS / B.shot('admin', '021', viewport='mobile')['file'], (0, 0, 780, 1500), 520, 82, 'cover-phone')
    return f'''
<section class="cover">
  <div>
    <div class="shaft"><span></span><span></span><span class="dim"></span></div>
    <div class="brand">AIEC</div>
    <div class="company">ALL INDIA ELEVATORS COMPANY</div>
  </div>
  <div class="middle">
    <div>
      <div class="title">वापरकर्ता<br>पुस्तिका</div>
      <div class="subtitle">लिफ्ट व्यवसायाचे बहु-भूमिका व्यासपीठ:<br>प्रशासक, सर्वेक्षक, तंत्रज्ञ, ग्राहक आणि पुरवठादार</div>
      <div class="rule"></div>
      <div class="meta">
        <div><b>अ‍ॅप आवृत्ती:</b> {VERSION} (package.json नुसार)</div>
        <div><b>भाषा:</b> मराठी (अ‍ॅप इंग्रजी आणि हिंदीतही चालते)</div>
        <div><b>दस्तऐवज तारीख:</b> १० ऑक्टोबर २०२६</div>
        <div><b>स्क्रीनशॉट:</b> चालू अ‍ॅपमधून घेतलेले, नमुना डेटासह</div>
      </div>
    </div>
    <img class="shot" src="{home}" alt="AIEC होम स्क्रीन">
  </div>
  <div class="small muted">ही पुस्तिका अ‍ॅपच्या प्रत्यक्ष कोडवर आणि चालू अ‍ॅपवर आधारित आहे. स्क्रीनवरील नावे आणि संदेश अ‍ॅपमधून जसेच्या तसे घेतले आहेत.</div>
</section>'''


# ================================================================= 2 document information

def ch_docinfo():
    D.chapter_h('दस्तऐवजाची माहिती', 'docinfo')
    D.h2('उद्देश', 'doc-purpose')
    D.p('ही पुस्तिका AIEC अ‍ॅप पहिल्यांदा वापरणाऱ्या प्रत्येकासाठी आहे: अ‍ॅप कशासाठी आहे, त्यात कसे फिरायचे, आपले रोजचे काम '
        'कसे करायचे, स्क्रीनवर दिसणारे आकडे कसे वाचायचे आणि काही अडले तर काय करायचे. प्रत्येक सूचना अ‍ॅपच्या प्रत्यक्ष '
        'स्क्रीनवरून लिहिली आहे आणि तिच्या शेजारी त्याच स्क्रीनचा खरा स्क्रीनशॉट आहे.')
    D.h2('कोणासाठी', 'doc-audience')
    D.table(['वाचक', 'कोणते प्रकरण आधी वाचावे'], [
        ['प्रशासक (मालक, ऑफिस)', f'{S("ch-access")}, {S("ch-interface")}, आणि {S("ch-features")} मधील सर्व विभाग'],
        ['सर्वेक्षक (फील्ड पार्टनर)', f'{S("ch-access")}, {S("m-surveyor")}, {S("m-training")}, {S("m-payouts")}'],
        ['तंत्रज्ञ (इन्स्टॉलेशन टीम)', f'{S("ch-access")}, {S("m-install")}, {S("m-qc")}, {S("m-logistics")}'],
        ['ग्राहक', f'{S("ch-access")}, {S("m-customer")}, {S("m-payments")}'],
        ['पुरवठादार / उत्पादक', f'{S("ch-access")}, {S("m-suppliers")}, {S("m-supplier-pay")}'],
    ])
    D.h2('आवृत्ती आणि बदलांचा इतिहास', 'doc-history')
    D.table(['पुस्तिका आवृत्ती', 'तारीख', 'अ‍ॅप आवृत्ती', 'बदल'], [
        ['1.0', '१० ऑक्टोबर २०२६', VERSION, 'पहिली संपूर्ण मराठी पुस्तिका: 200 स्क्रीन, 298 स्क्रीनशॉट.'],
    ])
    D.p('पानांचे क्रमांक मुखपृष्ठानंतरच्या पानापासून (1) मोजले आहेत; अनुक्रमणिकेतील क्रमांक पानाच्या तळाशी छापलेल्या क्रमांकाप्रमाणे आहेत. '
        'PDF मध्ये डावीकडील बुकमार्क आणि अनुक्रमणिकेतील ओळी दाबल्यावर थेट त्या विभागावर जाता येते.')
    D.h2('व्याप्ती आणि मर्यादा', 'doc-scope')
    D.p('पुस्तिकेत अ‍ॅपच्या सर्व 20 विभागांतील 200 स्क्रीनचा समावेश आहे. प्रत्येक स्क्रीनचा किमान एक स्क्रीनशॉट परिशिष्टातील '
        f'चित्रसंग्रहात ({S("app-gallery")}) आहे; मुख्य कामांचे टप्प्याटप्प्याने मार्गदर्शन {S("ch-features")} आणि {S("ch-workflows")} मध्ये आहे.')
    D.callout('note', 'सर्व स्क्रीनशॉट अ‍ॅपच्या <b>नमुना डेटा</b> असलेल्या आवृत्तीतून घेतले आहेत (डेमो बिल्ड). त्यातील नावे, फोन क्रमांक, '
              'रकमा आणि कंपन्या नमुना आहेत, खऱ्या नाहीत. तुमच्या खात्यात तुमचा स्वतःचा डेटा दिसेल, पण स्क्रीनची रचना आणि '
              'बटणे तीच असतील.')
    D.ul([
        'या बिल्डमध्ये SMS, WhatsApp, पेमेंट गेटवे, बँक, नकाशे सेवा आणि ओळख-पडताळणी सेवा जोडलेल्या नाहीत. अ‍ॅप स्वतः हे स्क्रीनवर '
        'सांगते (उदा. OTP स्क्रीनवर कोड स्क्रीनवरच दाखवला जातो). अशा ठिकाणी पुस्तिकाही तेच सांगते.',
        'प्रत्यक्ष Supabase सर्व्हरवर साइन-इन (S1) कोडमध्ये तयार आहे, पण हे स्क्रीनशॉट सर्व्हरशिवाय घेतले आहेत. सर्व्हरवर साइन-इनचे '
        f'फरक {S("acc-roles")} मध्ये स्वतंत्रपणे सांगितले आहेत आणि ते या पुस्तिकेसाठी चालवून पाहिलेले नाहीत.',
        'पुस्तिका अ‍ॅपच्या कोडमधील वर्तनावर आधारित आहे. जे वर्तन स्क्रीनशॉट घेताना प्रत्यक्ष चालवून पाहिले नाही, ते '
        '<span class="unverified">पडताळले नाही</span> असे चिन्हांकित केले आहे.',
    ])


# ================================================================= 3 contents

def ch_toc():
    D.chapter_h('अनुक्रमणिका', 'toc')
    D.raw('<!--TOC-->')


# ================================================================= 4 overview

def ch_overview():
    D.chapter_h('अ‍ॅपचा परिचय', 'ch-overview')
    D.p('ALL INDIA ELEVATORS COMPANY (AIEC) चे अ‍ॅप हे लिफ्ट व्यवसायाचे एकच व्यासपीठ आहे. एखादी इमारत पहिल्यांदा दिसल्यापासून '
        '(सर्वेक्षकाचा लीड) ते लिफ्ट ग्राहकाच्या ताब्यात देऊन तिची सर्व्हिस सुरू होईपर्यंतचा प्रत्येक टप्पा याच अ‍ॅपमध्ये '
        'होतो, आणि प्रत्येक भूमिकेला फक्त तिच्या कामाचा भाग दिसतो.', 'lead-in')
    D.h2('मुख्य उद्दिष्टे आणि क्षमता', 'ov-goals')
    D.ul([
        '<b>विक्री:</b> साइटवरून लीड नोंदवणे, CRM मध्ये पाठपुरावा, आपोआप कोटेशन, वाटाघाटी, डिजिटल करार आणि ई-स्वाक्षरी.',
        '<b>पैसे:</b> ग्राहकाच्या पेमेंटचे टप्पे, स्मरणपत्रे, ऑनलाइन पेमेंट, इनव्हॉइस, वाद आणि परतावा; पुरवठादारांची देयके; भागीदारांचे कमिशन आणि पेआउट.',
        '<b>पुरवठा आणि डिलिव्हरी:</b> खरेदी ऑर्डर, पुरवठादारांचे कॅटलॉग, उत्पादनाची स्थिती, शिपमेंट ट्रॅकिंग, साइटवरील डिलिव्हरी चेकलिस्ट.',
        '<b>इन्स्टॉलेशन आणि गुणवत्ता:</b> टप्प्याटप्प्याची SOP चेकलिस्ट, फोटो/व्हिडिओ पुरावे, सुरक्षा तपासण्या, स्वतंत्र गुणवत्ता तपासणी, हस्तांतरण आणि वॉरंटी.',
        '<b>लोक:</b> भागीदारांची भरती, प्रशिक्षण आणि प्रमाणपत्रे, टियर, स्पर्धा आणि बॅज.',
        '<b>देखरेख:</b> थेट नकाशा, डॅशबोर्ड, सूचना, ऑटोमेशन, सुरक्षा, बॅकअप, गोपनीयता आणि परवानग्या.',
    ])
    D.h2('कोणी वापरावे', 'ov-roles')
    D.table(['भूमिका', 'अ‍ॅपमधील मुख्य काम'], [
        [ROLE['admin'], 'संपूर्ण व्यवसाय चालवणे: मंजुरी, निर्णय, सेटिंग, अहवाल. 160 स्क्रीन (बहुतांश फक्त Admin साठी).'],
        [ROLE['surveyor'], 'साइटवर जाऊन नवीन लीड नोंदवणे, आपले लीड आणि कमाई पाहणे, प्रशिक्षण.'],
        [ROLE['technician'], 'नेमलेली कामे, इन्स्टॉलेशनची चेकलिस्ट, पुरावे, सुरक्षा आणि गुणवत्ता तपासण्या.'],
        [ROLE['customer'], 'आपल्या प्रकल्पाची प्रगती, पेमेंट, कागदपत्रे, सर्व्हिस विनंत्या आणि चॅट.'],
        [ROLE['supplier'], 'AIEC कडून आलेल्या ऑर्डर, कॅटलॉग, इनव्हॉइस, पेमेंट आणि करार.'],
    ])
    D.h2('मुख्य फायदे', 'ov-benefits')
    D.ul([
        'प्रत्येक आकडा एकाच नोंदीतून येतो: डॅशबोर्डवरील रक्कम आणि तपशीलातील रक्कम कधीही वेगळी नसते.',
        'प्रत्येक वचनाला मालक आणि मुदत असते. उशीर झाल्यास अ‍ॅप स्वतः आठवण करून देते आणि गरज पडल्यास Admin ला कळवते.',
        'मोबाइलसाठी आधी डिझाइन केलेले, पण टॅबलेट आणि संगणकावरही चालते. फील्डमधील काही कामे सिग्नल नसतानाही होतात.',
        'तीन भाषा (English, हिन्दी, मराठी) आणि सात रंगसंगती, प्रत्येकाला आपल्या आवडीनुसार.',
    ])
    D.h2('मूळ कार्यप्रवाह', 'ov-flow')
    D.p(f'खालील साखळी अ‍ॅपच्या स्क्रीनच्या क्रमानुसार आहे. प्रत्येक टप्प्याचे तपशीलवार मार्गदर्शन {S("ch-workflows")} मध्ये आहे.')
    D.flow([('लीड', 'सर्वेक्षक साइट नोंदवतो'), ('CRM', 'पाठपुरावा, नेमणूक'), ('कोटेशन', 'किंमत आपोआप'),
            ('डील', 'वाटाघाटी, करार, सही'), ('पेमेंट', 'टप्प्याटप्प्याने')])
    D.flow([('खरेदी', 'PO पुरवठादाराकडे'), ('डिलिव्हरी', 'साइटवर तपासणी'), ('इन्स्टॉलेशन', 'SOP आणि पुरावे'),
            ('गुणवत्ता', 'स्वतंत्र तपासणी'), ('हस्तांतरण', 'प्रमाणपत्र, वॉरंटी')])
    D.figure('ov-home', 'admin', '021', 'प्रशासकाचे होम: व्यवसायाचे आत्ताचे चित्र (लीड, रूपांतर, महसूल, थकीत पैसे)', sidebar=True, width='w-full')
    D.p(f'प्रशासक साइन इन केल्यावर पहिली स्क्रीन होम असते ({F("ov-home")}). तिचे भाग {S("ch-interface")} आणि {S("ch-reports")} मध्ये समजावले आहेत.')


# ================================================================= 5 access

def ch_access():
    D.chapter_h('सिस्टम आवश्यकता आणि प्रवेश', 'ch-access')
    D.h2('आवश्यक साधने', 'acc-req')
    D.table(['बाब', 'माहिती'], [
        ['उपकरण', 'स्मार्टफोन, टॅबलेट किंवा संगणक. अ‍ॅप फोनच्या रुंदीसाठी (390 px) आधी डिझाइन केले आहे आणि टॅबलेट (≈820 px) व संगणकावर (≈1440 px) आपोआप जुळवून घेते.'],
        ['ब्राउझर', 'अ‍ॅप वेब-अ‍ॅप आहे. स्क्रीन 200 (अ‍ॅप आवृत्ती) Chrome, Edge, Firefox आणि Safari ओळखते आणि नवीन आवृत्तीसाठी ब्राउझर जुना असल्यास तसे सांगते. ही पुस्तिका Chromium मध्ये तपासली आहे; इतर ब्राउझर या पुस्तिकेसाठी <span class="unverified">पडताळले नाहीत</span>.'],
        ['इंटरनेट', 'बहुतेक कामांसाठी आवश्यक. सिग्नलशिवाय चालणारी कामे (उदा. इन्स्टॉलेशन चेकलिस्ट, पुरावे, चॅटचा संदेश) फोनवर ठेवली जातात आणि सिग्नल आल्यावर पाठवली जातात; अ‍ॅप तसे स्क्रीनवर दाखवते.'],
        ['परवानग्या', 'स्थान (साइट भेट आणि चेक-इनसाठी), कॅमेरा (फोटो/व्हिडिओ पुरावे), सूचना. स्क्रीन 010 प्रत्येक परवानगी कशासाठी आहे ते आधी समजावते.'],
        ['खाते', 'AIEC मध्ये नोंदलेला 10 अंकी भारतीय मोबाइल क्रमांक.'],
    ])
    D.h2('अ‍ॅप उघडणे आणि साइन इन', 'acc-login')
    D.p(f'अ‍ॅपचा पत्ता उघडल्यावर स्वागत स्क्रीन (001) येते; पुढे गेल्यावर किंवा {U("001:splash.skip")} दाबल्यावर साइन-इन स्क्रीन (002) येते.')
    D.steps([
        f'{U("002:login.tab.login")} टॅब निवडलेला असल्याची खात्री करा आणि {U("002:login.method.phone")} पद्धत निवडा.',
        f'{U("002:login.field.phone")} मध्ये तुमचा 10 अंकी क्रमांक टाका (+91 आधीच लावलेला असतो). {F("acc-login")} पहा.',
        f'हवे असल्यास {U("002:login.remember")} टिक करा.',
        f'{U("002:login.continueWithOtp")} दाबा. कोड स्क्रीन (003) उघडते ({F("acc-otp")}).',
        f'6 अंकी कोड टाका. सहावा अंक टाकताच कोड आपोआप तपासला जातो; गरज असल्यास {U("003:otp.verify")} दाबा.',
        'Admin, आणि सुरक्षा नियमांनुसार ज्यांना लागू आहे (सध्या तंत्रज्ञ), त्यांना पुढे दुसरी पायरी येते: आणखी एक 6 अंकी कोड टाका '
        f'आणि {U("195:secGate.second.go")} दाबा ({F("acc-gate")}).',
        'साइन-इन झाल्यावर तुमच्या भूमिकेचे होम उघडते (Admin: होम डॅशबोर्ड, सर्वेक्षक: होम, तंत्रज्ञ: माझी कामं, ग्राहक: मुख्यपृष्ठ, पुरवठादार: ऑर्डर).',
    ])
    D.fig_row([
        D.figure_file('acc-login', B.SHOTS / 'flow' / 'login-phone-entered.png', 'साइन-इन: मोबाइल क्रमांक टाकलेला', 'w-full', (300, 0, 980, 720), 900, inline=True),
        D.figure_file('acc-otp', B.SHOTS / 'flow' / 'otp-screen.png', 'कोड स्क्रीन: 6 अंकी कोड', 'w-full', (300, 0, 980, 820), 900, inline=True),
    ])
    D.callout('note', f'या बिल्डमध्ये SMS सेवा जोडलेली नाही, त्यामुळे कोड स्क्रीनवरच दाखवला जातो: {Q("003:otp.noGateway", code="123456")} '
              'डेमोमध्ये तो 123456 असतो. दुसऱ्या पायरीचा कोड (246810) त्याच स्क्रीनवर लिहिलेला असतो.')
    D.figure_file('acc-gate', B.ROOT / 'manual_assets' / 'annotations' / 'second-step-gate.png',
                  'साइन-इनची दुसरी पायरी (Admin आणि ज्यांना नियम लागू आहे)', 'w-wide', (300, 0, 980, 450), 900)
    D.h3('डेमो पहा (खाते नसताना)')
    D.p(f'{U("002:login.tab.demo")} टॅबवर कोणतीही भूमिका निवडून थेट नमुना डेटा असलेल्या खात्यात जाता येते ({F("acc-demo")}). '
        f'{Q("002:login.demo.safety")}')
    D.figure_file('acc-demo', B.ROOT / 'manual_assets' / 'annotations' / 'login-demo-tab.png', 'डेमो टॅब: भूमिका निवडा', 'w-wide', (300, 0, 980, 700), 900)
    D.h3('या पुस्तिकेसाठी वापरलेली नमुना खाती')
    D.table(['भूमिका', 'मोबाइल क्रमांक (नमुना)', 'नाव (नमुना)'], [
        [ROLE['admin'], '9822011001', 'Prashant Vasant Wable'], [ROLE['surveyor'], '9822022001', 'Ganesh Pawar'],
        [ROLE['technician'], '9822033001', 'Santosh Kale'], [ROLE['customer'], '9822044001', 'Rajesh Agarwal'],
        [ROLE['supplier'], '9822055001', 'Vertex Elevator Components'],
    ])
    D.callout('warn', 'हे क्रमांक फक्त डेमो/प्रशिक्षण बिल्डसाठी आहेत. खऱ्या (सर्व्हर) बिल्डमध्ये प्रत्येकाचा स्वतःचा क्रमांक आणि SMS ने आलेला कोड वापरला जातो.')
    D.h2('नवीन खाते आणि भूमिका', 'acc-roles')
    D.p('खाते मिळण्याचे तीन मार्ग अ‍ॅपमध्ये आहेत:')
    D.ul([
        f'<b>भागीदार (सर्वेक्षक, तंत्रज्ञ, पुरवठादार):</b> सार्वजनिक पान {P("/join")} (स्क्रीन 141) वरून आवड नोंदवा, मिळालेल्या लिंकवर अर्ज भरा (142). Admin छाननी, मुलाखत, पडताळणी आणि ऑफर करतो; करारावर सही केल्यावर खाते सुरू होते ({S("m-recruit")}).',
        '<b>ग्राहक:</b> डील झाल्यावर ग्राहकाचे खाते लीडवरून तयार होते; ग्राहक स्क्रीन 008 वर आपली माहिती तपासून पुष्टी करतो.',
        f'<b>अनोळखी क्रमांक (सर्व्हर बिल्ड):</b> साइन-इन होते पण भूमिका नसते; व्यक्ती आपण कोणत्या भूमिकेत येत आहोत ते सांगते आणि Admin स्क्रीन 004 वर ({P("/onboarding/role")}) भूमिका देतो. <span class="unverified">पडताळले नाही</span> (सर्व्हरशिवाय)',
    ])
    D.h3('भूमिका आणि परवानग्या')
    D.p('प्रत्येक स्क्रीन ज्या भूमिकांसाठी बनवली आहे त्यांनाच उघडते. दुसऱ्या भूमिकेची स्क्रीन उघडल्यास '
        f'{Q("common:forbidden.title")} असे पान येते. Admin स्क्रीन 192 वरून भूमिकांना स्क्रीन देऊ/काढू शकतो आणि सानुकूल भूमिका बनवू शकतो '
        f'({S("m-settings")}). प्रत्येक भूमिकेच्या स्क्रीनची यादी परिशिष्ट B मध्ये आहे.')
    D.h2('साइन आउट आणि सत्र', 'acc-session')
    D.steps([
        f'संगणकावर: डाव्या मेनूच्या तळाशी {U("common:action.signOut")} दाबा. फोनवर: {NAV("settings")} टॅब उघडून तळाशी {U("common:action.signOut")} दाबा.',
        'साइन आउट झाल्यावर साइन-इन स्क्रीन येते.',
    ])
    D.ul([
        'Admin चे सत्र 60 मिनिटे न वापरल्यास किंवा 12 तासांनी संपते; फील्ड भूमिकांचे 7 दिवस / 30 दिवस (स्क्रीन 195 चे मूळ नियम; Admin ते बदलू शकतो).',
        'Admin दुसऱ्या उपकरणावरील तुमचे सत्र दूरून बंद करू शकतो (उदा. फोन हरवल्यास). तसे झाल्यास तुमच्या उपकरणावर काही सेकंदांत "पुन्हा साइन इन करा" अशी स्क्रीन येते.',
        'डेमो बिल्डमध्ये डेटा ब्राउझरच्या मेमरीत असतो: पान रीलोड केल्यास नमुना डेटा मूळ स्थितीत परत येतो.',
    ])


# ================================================================= 6 interface

def ch_interface():
    D.chapter_h('इंटरफेस समजून घेणे', 'ch-interface')
    D.p('सर्व भूमिकांची रचना एकसारखी आहे: वर ब्रँड आणि घंटा, एक मेनू, आणि मधोमध त्या वेळची स्क्रीन. संगणकावर मेनू डावीकडे असतो, '
        'फोनवर तो तळाशी टॅबच्या रूपात असतो.')
    ann = B.ANNOT['layoutDesktop']
    marks = [(1, 16, 24, 207, 54), (2, 16, 82, 207, 48), (3, 16, 134, 207, 48), (4, 16, 186, 207, 620),
             (5, 600, 8, 330, 60), (6, 258, 136, 270, 40), (7, 258, 192, 1004, 284), (8, 16, 812, 207, 44)]
    p = B.annotate(B.ROOT / 'manual_assets' / 'annotations' / ann['file'], marks, 1, 'layout-desktop-annotated')
    D.figure_file('ui-desktop', p, 'संगणकावरील रचना (Admin चे होम), क्रमांकित भाग', 'w-full', None, 1280)
    D.table(['क्र.', 'भाग', 'काय करतो'], [
        ['1', 'ब्रँड', 'AIEC चे नाव (कंपनी प्रोफाइलमध्ये लोगो दिल्यास लोगो).'],
        ['2', f'घंटा: {U("common:work.bell")}', 'तुमची वचने, उशिरा झालेली कामे आणि अ‍ॅपने तुमच्यासाठी आपोआप केलेली कामे. आकडा = न वाचलेल्या गोष्टी. दाबल्यावर "तुमचा दिवस" उघडतो (आकृती खाली).'],
        ['3', 'चालू टॅब', 'तुम्ही कोणत्या भागात आहात ते सोनेरी रंगात दाखवते.'],
        ['4', 'मेनू', 'तुमच्या भूमिकेचे मुख्य भाग. Admin चे: होम, नकाशा, लीड, संवाद, कोटेशन, व्यवहार, पुरवठादार, पुरवठादार पेमेंट, लॉजिस्टिक्स, भागीदार, विश्लेषण, सूचना, सेटिंग.'],
        ['5', 'शीर्षक', 'स्क्रीनचे नाव आणि एका ओळीत ती कशासाठी आहे.'],
        ['6', 'कालावधी टॅब', 'आकडे कोणत्या कालावधीचे ते निवडा (आज, आठवडा, महिना, तिमाही).'],
        ['7', 'कार्ड', 'मुख्य आकडे. बहुतेक कार्ड दाबल्यावर त्यामागील तपशील उघडतो.'],
        ['8', 'साइन आउट', 'या उपकरणावरून बाहेर पडा.'],
    ])
    m = B.ANNOT['layoutMobile']
    pm = B.annotate(B.ROOT / 'manual_assets' / 'annotations' / m['file'], [(1, 4, 2, 200, 45), (2, 334, 0, 52, 48), (3, 100, 60, 190, 70), (4, 0, 791, 390, 53)], 2, 'layout-mobile-annotated')
    a = B.ROOT / 'manual_assets' / 'annotations' / 'assistant-drawer.png'
    D.fig_row([
        D.figure_file('ui-mobile', pm, 'फोनवरील रचना: 1 ब्रँड, 2 घंटा, 3 शीर्षक, 4 तळाचे टॅब', 'w-full', None, 600, inline=True),
        D.figure_file('ui-assistant', a, '"तुमचा दिवस": घंटा दाबल्यावर', 'w-full', (320, 76, 960, 784), 700, inline=True),
    ])
    D.h2('घंटा आणि "तुमचा दिवस"', 'ui-bell')
    D.p(f'घंटा दाबल्यावर {F("ui-assistant")} प्रमाणे पडदा उघडतो. त्यात तुमची प्रत्येक बाकी गोष्ट मुदतीसह असते (उदा. "थकीत — 113 दिवस") '
        f'आणि {U("common:work.open")} दाबल्यावर ती गोष्ट जिथे करायची ती स्क्रीन उघडते. वरच्या ओळीत तुमची वेळेवर पूर्ण होण्याची टक्केवारी असते.')
    D.h2('याद्या, शोध आणि तपशील', 'ui-lists')
    D.ul([
        'बहुतेक याद्यांच्या वर शोधपेटी आणि गोळीसारखी फिल्टर बटणे असतात; फिल्टर दाबताच यादी बदलते. अनेक स्क्रीनवर निवडलेले फिल्टर पत्त्यात (URL) राहतात, त्यामुळे तीच लिंक पुन्हा उघडल्यास तेच दृश्य येते.',
        f'यादीतील ओळ दाबल्यावर खालून/मधून "शीट" उघडते ({F("ui-sheet")}). शीट बंद करण्यासाठी × दाबा किंवा Esc.',
        'लांब याद्या 20–25 च्या भागांत येतात; तळाशी "आणखी दाखवा" असते.',
        'माहिती येत असताना राखाडी चौकटी (लोडिंग) दिसतात; काही नसल्यास "काहीही नाही" संदेश; अडचण आल्यास लाल चिन्हासह त्रुटी आणि "पुन्हा प्रयत्न करा".',
    ])
    D.figure_file('ui-sheet', B.ROOT / 'manual_assets' / 'annotations' / 'lead-detail.png', 'यादीतील ओळ दाबल्यावर उघडणारी शीट (लीड इनबॉक्स)', 'w-wide', (240, 0, 1280, 860), 1100)
    D.h2('भाषा आणि रंगसंगती', 'ui-lang')
    D.p(f'{NAV("settings")} मध्ये {U("common:settings.language")} आणि {U("common:settings.appearance")} बदलता येतात ({S("ch-settings")}). '
        'भाषा बदलताच संपूर्ण अ‍ॅप आणि त्याचा फॉन्ट बदलतो. खालील दोन आकृत्यांत एकच स्क्रीन दोन रंगसंगतींत दिसते.')
    D.fig_row([
        D.figure_file('ui-lang-mr', B.SHOTS / 'language' / 'surveyor-home-marathi.png', 'सर्वेक्षकाचे होम (मराठी, गडद रंगसंगतीत, उपकरणाच्या पसंतीनुसार)', 'w-full', (240, 0, 1280, 700), 900, inline=True),
        D.figure('ui-lang-light', 'surveyor', '031', 'तेच होम, हलक्या रंगसंगतीत', inline=True, max_h=700),
    ])


# ================================================================= assemble

def write():
    global D
    D = B.Doc()
    D.chapter = 1  # section 1 is the cover; the numbering follows the manual's fifteen sections
    import modules_mr
    import rest_mr
    for mod in (modules_mr, rest_mr):
        mod.D = D
    ch_docinfo()
    ch_toc()
    ch_overview()
    ch_access()
    ch_interface()
    modules_mr.ch_features()
    rest_mr.ch_workflows()
    rest_mr.ch_data()
    rest_mr.ch_reports()
    rest_mr.ch_settings()
    rest_mr.ch_troubleshoot()
    rest_mr.ch_security()
    rest_mr.ch_glossary()
    rest_mr.ch_appendix()
    return cover(), D


def write_inventory(doc):
    import rest_mr
    rest_mr.write_inventory(doc)
