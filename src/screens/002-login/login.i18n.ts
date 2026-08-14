import type { ScreenTranslations } from '@/i18n/types';

const translations: ScreenTranslations = {
  en: {
    login: {
      title: 'Sign in to AIEC',
      subtitle: 'One platform for surveyors, technicians, suppliers and customers.',
      tab: { login: 'Login', demo: 'Try Demo' },
      method: { phone: 'Phone', email: 'Email' },
      field: {
        phone: 'Mobile number',
        phoneHint: 'We will send a 6-digit code to this number.',
        email: 'Email address',
        password: 'Password',
      },
      remember: 'Keep me signed in on this device',
      continueWithOtp: 'Continue',
      google: 'Continue with Google',
      forgot: 'Forgotten your password?',
      simulatedNote:
        'No SMS is sent in this build — there is no messaging gateway connected yet.',
      demo: {
        heading: 'Look around first',
        body: 'Pick a role and step straight into a fully populated account. Nothing to fill in.',
        entering: 'Opening…',
        role: {
          admin: 'The live map, the numbers, and every exception in one place.',
          surveyor: 'Capture a site, track your leads, watch your commission add up.',
          technician: 'Your jobs, step by step, with proof at every safety stage.',
          customer: 'Follow your own project from order to handover.',
        },
        safety:
          'Demo accounts use sample data only. No real payment or payout can be made from them.',
      },
      error: {
        unknownNumber:
          'No AIEC account uses this number yet. Ask your admin to add you, or sign up as a partner.',
        roleMismatch:
          'This number is already registered under a different role. Ask your admin to change it rather than creating a second account.',
        badCredentials: 'That email and password combination did not match an account.',
        network: 'We could not reach AIEC. Check your connection and try again.',
        invalidPhone: 'Enter a 10-digit Indian mobile number.',
        invalidEmail: 'Enter a valid email address.',
      },
    },
  },

  hi: {
    login: {
      title: 'AIEC में साइन इन करें',
      subtitle: 'सर्वेक्षक, तकनीशियन, आपूर्तिकर्ता और ग्राहक — सबके लिए एक ही मंच।',
      tab: { login: 'लॉगिन', demo: 'डेमो देखें' },
      method: { phone: 'फ़ोन', email: 'ईमेल' },
      field: {
        phone: 'मोबाइल नंबर',
        phoneHint: 'हम इसी नंबर पर 6 अंकों का कोड भेजेंगे।',
        email: 'ईमेल पता',
        password: 'पासवर्ड',
      },
      remember: 'इस डिवाइस पर साइन इन रखें',
      continueWithOtp: 'आगे बढ़ें',
      google: 'Google से आगे बढ़ें',
      forgot: 'पासवर्ड भूल गए?',
      simulatedNote: 'इस बिल्ड में कोई SMS नहीं भेजा जाता — अभी कोई मैसेजिंग गेटवे जुड़ा नहीं है।',
      demo: {
        heading: 'पहले घूमकर देखिए',
        body: 'कोई भी भूमिका चुनिए और सीधे भरे-पूरे खाते में पहुँच जाइए। कुछ भरना नहीं है।',
        entering: 'खुल रहा है…',
        role: {
          admin: 'लाइव नक्शा, आँकड़े और हर अपवाद — सब एक जगह।',
          surveyor: 'साइट दर्ज कीजिए, अपने लीड देखिए, कमीशन बढ़ता हुआ देखिए।',
          technician: 'आपके काम, चरण-दर-चरण, हर सुरक्षा-चरण पर सबूत के साथ।',
          customer: 'ऑर्डर से हैंडओवर तक अपना प्रोजेक्ट खुद देखिए।',
        },
        safety: 'डेमो खातों में सिर्फ़ नमूना डेटा है। इनसे कोई असली भुगतान नहीं हो सकता।',
      },
      error: {
        unknownNumber:
          'इस नंबर से अभी कोई AIEC खाता नहीं जुड़ा है। अपने एडमिन से जुड़वाइए, या पार्टनर के रूप में साइन अप कीजिए।',
        roleMismatch:
          'यह नंबर पहले से किसी दूसरी भूमिका में दर्ज है। दूसरा खाता बनाने के बजाय अपने एडमिन से भूमिका बदलवाइए।',
        badCredentials: 'यह ईमेल और पासवर्ड किसी खाते से मेल नहीं खाया।',
        network: 'हम AIEC तक नहीं पहुँच पाए। अपना नेटवर्क जाँचिए और दोबारा कोशिश कीजिए।',
        invalidPhone: '10 अंकों का भारतीय मोबाइल नंबर डालिए।',
        invalidEmail: 'सही ईमेल पता डालिए।',
      },
    },
  },

  mr: {
    login: {
      title: 'AIEC मध्ये साइन इन करा',
      subtitle: 'सर्वेक्षक, तंत्रज्ञ, पुरवठादार आणि ग्राहक — सर्वांसाठी एकच व्यासपीठ.',
      tab: { login: 'लॉगिन', demo: 'डेमो पहा' },
      method: { phone: 'फोन', email: 'ईमेल' },
      field: {
        phone: 'मोबाइल क्रमांक',
        phoneHint: 'याच क्रमांकावर आम्ही ६ अंकी कोड पाठवू.',
        email: 'ईमेल पत्ता',
        password: 'पासवर्ड',
      },
      remember: 'या डिव्हाइसवर साइन इन ठेवा',
      continueWithOtp: 'पुढे जा',
      google: 'Google ने पुढे जा',
      forgot: 'पासवर्ड विसरलात?',
      simulatedNote: 'या बिल्डमध्ये SMS पाठवला जात नाही — अजून कोणताही मेसेजिंग गेटवे जोडलेला नाही.',
      demo: {
        heading: 'आधी फिरून पहा',
        body: 'कोणतीही भूमिका निवडा आणि थेट भरलेल्या खात्यात जा. काहीही भरायचे नाही.',
        entering: 'उघडत आहे…',
        role: {
          admin: 'थेट नकाशा, आकडे आणि प्रत्येक अपवाद — सर्व एकाच ठिकाणी.',
          surveyor: 'साइट नोंदवा, तुमचे लीड पहा, कमिशन वाढताना पहा.',
          technician: 'तुमची कामे, टप्प्याटप्प्याने, प्रत्येक सुरक्षा-टप्प्यावर पुराव्यासह.',
          customer: 'ऑर्डरपासून ताबा मिळेपर्यंत तुमचा प्रकल्प स्वतः पहा.',
        },
        safety: 'डेमो खात्यांत फक्त नमुना माहिती असते. त्यातून खरे पैसे कधीच जात नाहीत.',
      },
      error: {
        unknownNumber:
          'या क्रमांकाशी अजून कोणतेही AIEC खाते जोडलेले नाही. तुमच्या प्रशासकाकडून जोडून घ्या, किंवा भागीदार म्हणून नोंदणी करा.',
        roleMismatch:
          'हा क्रमांक आधीच दुसऱ्या भूमिकेत नोंदलेला आहे. दुसरे खाते तयार करण्याऐवजी प्रशासकाकडून भूमिका बदलून घ्या.',
        badCredentials: 'हा ईमेल आणि पासवर्ड कोणत्याही खात्याशी जुळला नाही.',
        network: 'आम्ही AIEC पर्यंत पोहोचू शकलो नाही. नेटवर्क तपासा आणि पुन्हा प्रयत्न करा.',
        invalidPhone: '१० अंकी भारतीय मोबाइल क्रमांक टाका.',
        invalidEmail: 'योग्य ईमेल पत्ता टाका.',
      },
    },
  },
};

export default translations;
