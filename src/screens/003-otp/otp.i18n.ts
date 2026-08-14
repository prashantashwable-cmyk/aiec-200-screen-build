import type { ScreenTranslations } from '@/i18n/types';

const translations: ScreenTranslations = {
  en: {
    otp: {
      title: 'Enter your code',
      sentTo: 'We sent a 6-digit code to {{phone}}.',
      inputLabel: 'Verification code digit',
      verify: 'Verify',
      verifying: 'Checking…',
      success: 'Verified',
      changeNumber: 'Use a different number',
      resend: 'Send it again',
      resendIn: 'You can ask for a new code in {{seconds}}s',
      resendCount: '{{used}} of {{max}} codes requested',
      countryNote:
        'Using a number outside India? It still works — just include the correct country code.',
      noGateway:
        'No messaging gateway is connected in this build, so nothing is actually sent by SMS. Your code is {{code}}.',
      expired: {
        title: 'That code has expired',
        body: 'Codes are valid for five minutes. Ask for a fresh one and we will start the clock again.',
        action: 'Send a new code',
      },
      cooldown: {
        title: 'Too many wrong codes',
        body: 'Take a short break — you can try again in {{seconds}} seconds.',
      },
      resendBlocked: {
        title: 'Too many code requests',
        body: 'For safety, only five codes can be sent to a number in ten minutes. Please wait a little and try again, or use a different number.',
      },
      error: {
        wrongCode: 'That code is not right. {{remaining}} attempts left before a short wait.',
        malformed: 'A code is exactly six digits.',
        network: 'We could not check the code. Try again in a moment.',
        missingContext: 'Start again from the sign-in screen so we know which number to verify.',
      },
    },
  },

  hi: {
    otp: {
      title: 'अपना कोड डालिए',
      sentTo: 'हमने {{phone}} पर 6 अंकों का कोड भेजा है।',
      inputLabel: 'सत्यापन कोड अंक',
      verify: 'जाँचें',
      verifying: 'जाँच हो रही है…',
      success: 'सत्यापित',
      changeNumber: 'दूसरा नंबर इस्तेमाल करें',
      resend: 'दोबारा भेजें',
      resendIn: '{{seconds}} सेकंड बाद नया कोड माँग सकते हैं',
      resendCount: '{{max}} में से {{used}} कोड माँगे गए',
      countryNote: 'भारत से बाहर का नंबर है? वह भी चलेगा — बस सही देश कोड लगाइए।',
      noGateway:
        'इस बिल्ड में कोई मैसेजिंग गेटवे जुड़ा नहीं है, इसलिए SMS सचमुच नहीं जाता। आपका कोड {{code}} है।',
      expired: {
        title: 'यह कोड समाप्त हो गया',
        body: 'कोड पाँच मिनट तक चलता है। नया कोड माँगिए, घड़ी फिर से शुरू हो जाएगी।',
        action: 'नया कोड भेजें',
      },
      cooldown: {
        title: 'बहुत बार ग़लत कोड',
        body: 'थोड़ा रुकिए — {{seconds}} सेकंड बाद दोबारा कोशिश कर सकते हैं।',
      },
      resendBlocked: {
        title: 'बहुत ज़्यादा कोड माँगे गए',
        body: 'सुरक्षा के लिए दस मिनट में एक नंबर पर सिर्फ़ पाँच कोड भेजे जा सकते हैं। थोड़ा रुककर दोबारा कोशिश कीजिए, या दूसरा नंबर इस्तेमाल कीजिए।',
      },
      error: {
        wrongCode: 'यह कोड सही नहीं है। थोड़े इंतज़ार से पहले {{remaining}} कोशिशें बची हैं।',
        malformed: 'कोड ठीक छह अंकों का होता है।',
        network: 'हम कोड जाँच नहीं पाए। थोड़ी देर में दोबारा कोशिश कीजिए।',
        missingContext: 'साइन-इन स्क्रीन से दोबारा शुरू कीजिए, ताकि हमें पता हो कौन सा नंबर जाँचना है।',
      },
    },
  },

  mr: {
    otp: {
      title: 'तुमचा कोड टाका',
      sentTo: 'आम्ही {{phone}} वर ६ अंकी कोड पाठवला आहे.',
      inputLabel: 'पडताळणी कोड अंक',
      verify: 'तपासा',
      verifying: 'तपासत आहे…',
      success: 'पडताळले',
      changeNumber: 'दुसरा क्रमांक वापरा',
      resend: 'पुन्हा पाठवा',
      resendIn: '{{seconds}} सेकंदांनी नवीन कोड मागू शकता',
      resendCount: '{{max}} पैकी {{used}} कोड मागितले',
      countryNote: 'भारताबाहेरचा क्रमांक आहे? तोही चालतो — फक्त बरोबर देश कोड लावा.',
      noGateway:
        'या बिल्डमध्ये मेसेजिंग गेटवे जोडलेला नाही, त्यामुळे SMS प्रत्यक्षात जात नाही. तुमचा कोड {{code}} आहे.',
      expired: {
        title: 'हा कोड कालबाह्य झाला',
        body: 'कोड पाच मिनिटे चालतो. नवीन कोड मागा, घड्याळ पुन्हा सुरू होईल.',
        action: 'नवीन कोड पाठवा',
      },
      cooldown: {
        title: 'खूप वेळा चुकीचा कोड',
        body: 'जरा थांबा — {{seconds}} सेकंदांनी पुन्हा प्रयत्न करता येईल.',
      },
      resendBlocked: {
        title: 'खूप जास्त कोड मागितले',
        body: 'सुरक्षेसाठी दहा मिनिटांत एका क्रमांकावर फक्त पाच कोड पाठवता येतात. जरा थांबून पुन्हा प्रयत्न करा, किंवा दुसरा क्रमांक वापरा.',
      },
      error: {
        wrongCode: 'हा कोड बरोबर नाही. थोड्या प्रतीक्षेआधी {{remaining}} प्रयत्न शिल्लक आहेत.',
        malformed: 'कोड नेमका सहा अंकांचा असतो.',
        network: 'आम्ही कोड तपासू शकलो नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.',
        missingContext: 'साइन-इन स्क्रीनवरून पुन्हा सुरू करा, म्हणजे कोणता क्रमांक तपासायचा ते आम्हाला कळेल.',
      },
    },
  },
};

export default translations;
