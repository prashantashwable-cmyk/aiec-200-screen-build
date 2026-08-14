import type { ScreenTranslations } from '@/i18n/types';

const translations: ScreenTranslations = {
  en: {
    routeOptimize: {
      title: 'Best match',
      subtitle: 'Every unassigned task, ranked by who can actually get to it well.',
      loading: 'Finding candidates',
      mapLabel: 'The task and the ranked candidates near it',
      taskList: 'Needs someone assigned',
      candidates: 'Ranked candidates',
      assign: 'Assign',
      assigning: 'Assigning…',
      assigned: '{{name}} assigned to {{task}}',
      alreadyAssigned: 'Already assigned',
      override: 'Choose someone else',
      overrideNote:
        'This ranking is a suggestion, not a rule — assign whoever you think is actually right for it.',
      noneEligible: 'Nobody is a sensible match right now',
      noneEligibleBody:
        'Everyone eligible is either too far away or unavailable. Rather than force a bad match, this is left for you to route by hand.',
      field: {
        distance: 'Distance',
        eta: 'ETA',
        workload: 'Open tasks',
        skillMatch: 'Skill match',
        score: 'Overall',
      },
      reason: { onLeave: 'On approved leave', wrongRole: 'Wrong role for this task' },
      newJoiner: 'New — ranked fairly on distance and skills alone',
      topPick: 'Top pick',
      kind: { leadFollowUp: 'Lead follow-up', jobAssignment: 'Installation' },
      empty: {
        title: 'Nothing waiting to be assigned',
        body: 'Every lead and job currently has an owner. New unassigned tasks will appear here.',
      },
      error: {
        title: 'Could not load candidates',
        body: 'We could not reach the staff data. Check your connection and try again.',
      },
    },
  },

  hi: {
    routeOptimize: {
      title: 'सबसे सही मेल',
      subtitle: 'हर बिना सौंपा काम, इस हिसाब से क्रम में कि कौन उसे सच में अच्छे से संभाल सकता है।',
      loading: 'उम्मीदवार खोजे जा रहे हैं',
      mapLabel: 'काम और उसके पास के क्रमबद्ध उम्मीदवार',
      taskList: 'किसी को सौंपना बाक़ी है',
      candidates: 'क्रमबद्ध उम्मीदवार',
      assign: 'सौंपें',
      assigning: 'सौंपा जा रहा है…',
      assigned: '{{name}} को {{task}} सौंपा गया',
      alreadyAssigned: 'पहले से सौंपा जा चुका',
      override: 'कोई और चुनें',
      overrideNote: 'यह क्रम एक सुझाव है, नियम नहीं — जिसे आप सही समझें उसे सौंपिए।',
      noneEligible: 'अभी कोई सही मेल नहीं है',
      noneEligibleBody:
        'जो भी योग्य हैं, वे या तो बहुत दूर हैं या उपलब्ध नहीं। ग़लत मेल थोपने के बजाय, इसे आप पर छोड़ा जा रहा है कि हाथ से तय कीजिए।',
      field: {
        distance: 'दूरी',
        eta: 'पहुँचने का समय',
        workload: 'खुले काम',
        skillMatch: 'हुनर मेल',
        score: 'कुल',
      },
      reason: { onLeave: 'मंज़ूर छुट्टी पर', wrongRole: 'इस काम के लिए ग़लत भूमिका' },
      newJoiner: 'नया — सिर्फ़ दूरी और हुनर के आधार पर निष्पक्ष क्रम',
      topPick: 'सबसे अच्छा',
      kind: { leadFollowUp: 'लीड फ़ॉलो-अप', jobAssignment: 'इंस्टॉलेशन' },
      empty: {
        title: 'सौंपने को कुछ बाक़ी नहीं',
        body: 'हर लीड और काम का अभी कोई न कोई मालिक है। नए बिना सौंपे काम यहीं दिखेंगे।',
      },
      error: {
        title: 'उम्मीदवार लोड नहीं हो पाए',
        body: 'हम स्टाफ़ डेटा तक नहीं पहुँच पाए। नेटवर्क जाँचिए और दोबारा कोशिश कीजिए।',
      },
    },
  },

  mr: {
    routeOptimize: {
      title: 'सर्वोत्तम जुळणी',
      subtitle: 'प्रत्येक न सोपवलेले काम, ते खरोखर चांगले कोण सांभाळू शकेल त्यानुसार क्रमवारीत.',
      loading: 'उमेदवार शोधत आहे',
      mapLabel: 'काम आणि त्याच्या जवळचे क्रमवारीतील उमेदवार',
      taskList: 'कोणाला तरी सोपवायचे आहे',
      candidates: 'क्रमवारीतील उमेदवार',
      assign: 'सोपवा',
      assigning: 'सोपवत आहे…',
      assigned: '{{name}} ला {{task}} सोपवले',
      alreadyAssigned: 'आधीच सोपवलेले',
      override: 'दुसरे कोणीतरी निवडा',
      overrideNote: 'ही क्रमवारी सूचना आहे, नियम नाही — तुम्हाला योग्य वाटेल त्याला सोपवा.',
      noneEligible: 'सध्या कोणतीही योग्य जुळणी नाही',
      noneEligibleBody:
        'पात्र असलेले सर्वजण एकतर खूप दूर आहेत किंवा उपलब्ध नाहीत. चुकीची जुळणी लादण्याऐवजी, हे तुमच्यावर सोडले आहे की हाताने ठरवा.',
      field: {
        distance: 'अंतर',
        eta: 'पोहोचण्याची वेळ',
        workload: 'खुली कामे',
        skillMatch: 'कौशल्य जुळणी',
        score: 'एकूण',
      },
      reason: { onLeave: 'मंजूर रजेवर', wrongRole: 'या कामासाठी चुकीची भूमिका' },
      newJoiner: 'नवीन — फक्त अंतर आणि कौशल्यांवर निष्पक्ष क्रमवारी',
      topPick: 'सर्वोत्तम',
      kind: { leadFollowUp: 'लीड पाठपुरावा', jobAssignment: 'बसवणूक' },
      empty: {
        title: 'सोपवण्यासारखे काही उरलेले नाही',
        body: 'प्रत्येक लीड आणि कामाला सध्या मालक आहे. नवीन न सोपवलेली कामे इथेच दिसतील.',
      },
      error: {
        title: 'उमेदवार लोड होऊ शकले नाहीत',
        body: 'आम्ही कर्मचारी माहितीपर्यंत पोहोचू शकलो नाही. नेटवर्क तपासा आणि पुन्हा प्रयत्न करा.',
      },
    },
  },
};

export default translations;
