export interface Scheme {
  id: string;
  nameEn: string;
  nameHi: string;
  ministryEn: string;
  ministryHi: string;
  category: 'Agriculture' | 'Healthcare' | 'Housing' | 'Pension' | 'Women & Child' | 'Skill & Artisan' | 'Livelihood';
  benefitAmount: string;
  benefitFrequency: string;
  descriptionEn: string;
  descriptionHi: string;
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number; // annual in INR
    maxLandAcres?: number;
    targetOccupation?: string[];
    gender?: 'All' | 'Female' | 'Male';
    ruralUrban?: 'All' | 'Rural' | 'Urban';
    specialRequirementsEn: string[];
    specialRequirementsHi: string[];
  };
  requiredDocuments: {
    code: string;
    nameEn: string;
    nameHi: string;
    mandatory: boolean;
    howToObtainEn: string;
    howToObtainHi: string;
  }[];
  formSteps: {
    stepId: number;
    titleEn: string;
    titleHi: string;
    fields: {
      key: string;
      labelEn: string;
      labelHi: string;
      type: 'text' | 'number' | 'select' | 'date';
      options?: string[];
      placeholder: string;
      helpTextEn: string;
      helpTextHi: string;
    }[];
  }[];
}

export const OFFICIAL_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    nameEn: 'PM-Kisan Samman Nidhi Yojana',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    ministryEn: 'Ministry of Agriculture and Farmers Welfare',
    ministryHi: 'कृषि एवं किसान कल्याण मंत्रालय',
    category: 'Agriculture',
    benefitAmount: '₹6,000',
    benefitFrequency: 'Annual (₹2,000 every 4 months)',
    descriptionEn: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.',
    descriptionHi: 'देश भर के सभी भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता (तीन समान किस्तों में ₹2,000)।',
    eligibilityCriteria: {
      minAge: 18,
      maxLandAcres: 5.0,
      targetOccupation: ['Farmer', 'Cultivator', 'Agriculture'],
      gender: 'All',
      ruralUrban: 'All',
      specialRequirementsEn: [
        'Cultivable agricultural landholding in family name',
        'Valid Aadhaar linked to bank account (NPCI seeded)',
        'Not an income tax payer or constitutional post holder'
      ],
      specialRequirementsHi: [
        'परिवार के नाम पर कृषि योग्य भूमि का स्वामित्व',
        'बैंक खाते से आधार लिंक (NPCI एक्टिव)',
        'आयकर दाता या सरकारी पेंशनभोगी नहीं होना चाहिए'
      ]
    },
    requiredDocuments: [
      {
        code: 'aadhaar',
        nameEn: 'Aadhaar Card',
        nameHi: 'आधार कार्ड',
        mandatory: true,
        howToObtainEn: 'UIDAI official portal or nearest Aadhaar Seva Kendra',
        howToObtainHi: 'UIDAI पोर्टल या निकटतम आधार सेवा केंद्र से'
      },
      {
        code: 'land_record',
        nameEn: 'Land Record (Khasra / Khatauni / 7/12)',
        nameHi: 'भूलेख रिकॉर्ड (खसरा / खतौनी / 7/12)',
        mandatory: true,
        howToObtainEn: 'State Bhulekh Land Records portal or Revenue Office / Patwari',
        howToObtainHi: 'राज्य भूलेख पोर्टल या राजस्व कार्यालय / पटवारी से'
      },
      {
        code: 'bank_passbook',
        nameEn: 'Bank Passbook (NPCI Seeded)',
        nameHi: 'बैंक पासबुक (NPCI आधार लिंक)',
        mandatory: true,
        howToObtainEn: 'Bank branch or online net banking statement',
        howToObtainHi: 'बैंक शाखा से पासबुक या ऑनलाइन स्टेटमेंट'
      }
    ],
    formSteps: [
      {
        stepId: 1,
        titleEn: 'Farmer Identity',
        titleHi: 'किसान की पहचान',
        fields: [
          { key: 'applicantName', labelEn: 'Full Name (as per Aadhaar)', labelHi: 'पूरा नाम (आधार अनुसार)', type: 'text', placeholder: 'e.g. Ramesh Kumar', helpTextEn: 'Must match Aadhaar spelling exactly', helpTextHi: 'आधार कार्ड पर लिखे नाम से मेल खाना चाहिए' },
          { key: 'aadhaarNumber', labelEn: 'Aadhaar Number', labelHi: 'आधार संख्या', type: 'text', placeholder: '12-digit UID', helpTextEn: 'Masked for safety in records', helpTextHi: '12 अंकों का आधार नंबर' },
          { key: 'gender', labelEn: 'Gender', labelHi: 'लिंग', type: 'select', options: ['Male', 'Female', 'Other'], placeholder: 'Select Gender', helpTextEn: 'Gender as in official records', helpTextHi: 'आधिकारिक रिकॉर्ड के अनुसार लिंग' }
        ]
      },
      {
        stepId: 2,
        titleEn: 'Landholding & Location',
        titleHi: 'भूमि और स्थान विवरण',
        fields: [
          { key: 'state', labelEn: 'State', labelHi: 'राज्य', type: 'text', placeholder: 'e.g. Uttar Pradesh, Maharashtra', helpTextEn: 'State where land is situated', helpTextHi: 'जहाँ कृषि भूमि स्थित है' },
          { key: 'district', labelEn: 'District', labelHi: 'ज़िला', type: 'text', placeholder: 'e.g. Varanasi, Nashik', helpTextEn: 'Administrative revenue district', helpTextHi: 'राजस्व ज़िला' },
          { key: 'khasraNumber', labelEn: 'Khasra / Survey Number', labelHi: 'खसरा / सर्वे नंबर', type: 'text', placeholder: 'e.g. 142/3B', helpTextEn: 'Unique plot number in revenue records', helpTextHi: 'राजस्व अभिलेखों में दर्ज खाता संख्या' },
          { key: 'landAreaAcres', labelEn: 'Cultivable Area (Acres)', labelHi: 'कृषि योग्य भूमि (एकड़)', type: 'number', placeholder: 'e.g. 2.4', helpTextEn: 'Total cultivable area owned', helpTextHi: 'कुल स्वामित्व वाली कृषि भूमि' }
        ]
      },
      {
        stepId: 3,
        titleEn: 'Bank & Direct Benefit Transfer',
        titleHi: 'बैंक खाता व डीबीटी विवरण',
        fields: [
          { key: 'accountNumber', labelEn: 'Bank Account Number', labelHi: 'बैंक खाता संख्या', type: 'text', placeholder: 'e.g. 918237461928', helpTextEn: 'Active savings bank account', helpTextHi: 'सक्रिय बचत बैंक खाता' },
          { key: 'ifscCode', labelEn: 'Bank IFSC Code', labelHi: 'आईएफएससी कोड (IFSC)', type: 'text', placeholder: 'e.g. SBIN0001234', helpTextEn: 'Branch IFSC code', helpTextHi: 'शाखा का 11 अक्षरों का कोड' },
          { key: 'npciSeeded', labelEn: 'Aadhaar NPCI Seeding Status', labelHi: 'एनपीसीआई आधार सीडिंग', type: 'select', options: ['Yes - Verified', 'Pending Verification'], placeholder: 'Select status', helpTextEn: 'Required for DBT transfer', helpTextHi: 'डीबीटी राशि सीधे प्राप्त करने हेतु अनिवार्य' }
        ]
      }
    ]
  },
  {
    id: 'ayushman-bharat',
    nameEn: 'Ayushman Bharat (PM-JAY)',
    nameHi: 'आयुष्मान भारत (प्रधानमंत्री जन आरोग्य योजना)',
    ministryEn: 'Ministry of Health and Family Welfare / NHA',
    ministryHi: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय / एनएचए',
    category: 'Healthcare',
    benefitAmount: '₹5,00,000',
    benefitFrequency: 'Annual health insurance cover per family',
    descriptionEn: 'Cashless hospital treatment up to ₹5 lakh per family per year across 27,000+ empaneled public and private hospitals in India.',
    descriptionHi: 'देशभर के 27,000+ सरकारी व निजी अस्पतालों में प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस इलाज।',
    eligibilityCriteria: {
      maxIncome: 250000,
      targetOccupation: ['Daily wage worker', 'Informal worker', 'Agricultural laborer', 'Artisan', 'BPL Household'],
      gender: 'All',
      ruralUrban: 'All',
      specialRequirementsEn: [
        'Families listed in SECC 2011 deprivation categories or NFSA ration card holders',
        'No ceiling on family size or age of family members',
        'Pre-existing diseases covered from day one'
      ],
      specialRequirementsHi: [
        'SECC 2011 डेटाबेस या राष्ट्रीय खाद्य सुरक्षा अंत्योदय राशन कार्ड धारक',
        'परिवार के आकार या उम्र पर कोई सीमा नहीं',
        'पहले से मौजूद बीमारियाँ भी पहले दिन से कवर'
      ]
    },
    requiredDocuments: [
      {
        code: 'aadhaar',
        nameEn: 'Aadhaar Card',
        nameHi: 'आधार कार्ड',
        mandatory: true,
        howToObtainEn: 'UIDAI portal or nearest Aadhaar center',
        howToObtainHi: 'निकटतम आधार केंद्र से'
      },
      {
        code: 'ration_card',
        nameEn: 'Ration Card (BPL / Antyodaya / NFSA)',
        nameHi: 'राशन कार्ड (बीपीएल / अंत्योदय)',
        mandatory: true,
        howToObtainEn: 'Food & Civil Supplies department portal or ration dealer',
        howToObtainHi: 'खाद्य एवं नागरिक आपूर्ति विभाग या उचित दर दुकान से'
      },
      {
        code: 'income_cert',
        nameEn: 'Income Certificate',
        nameHi: 'आय प्रमाण पत्र',
        mandatory: false,
        howToObtainEn: 'Tehsil office or State e-District portal',
        howToObtainHi: 'तहसील कार्यालय या ई-डिस्ट्रिक्ट पोर्टल से'
      }
    ],
    formSteps: [
      {
        stepId: 1,
        titleEn: 'Family Head Details',
        titleHi: 'परिवार के मुखिया का विवरण',
        fields: [
          { key: 'applicantName', labelEn: 'Head of Family Name', labelHi: 'मुखिया का नाम', type: 'text', placeholder: 'e.g. Sunita Devi', helpTextEn: 'Name as registered on ration card', helpTextHi: 'राशन कार्ड में दर्ज नाम' },
          { key: 'rationCardNo', labelEn: 'Ration Card Number', labelHi: 'राशन कार्ड नंबर', type: 'text', placeholder: '12 or 16 digit card number', helpTextEn: 'Used for SECC record matching', helpTextHi: 'राशन कार्ड संख्या' },
          { key: 'annualIncome', labelEn: 'Annual Household Income (INR)', labelHi: 'वार्षिक पारिवारिक आय (₹)', type: 'number', placeholder: 'e.g. 120000', helpTextEn: 'Total family income from all sources', helpTextHi: 'सभी स्रोतों से कुल वार्षिक आय' }
        ]
      },
      {
        stepId: 2,
        titleEn: 'Family Members & KYC',
        titleHi: 'परिवार के सदस्य और केवाईसी',
        fields: [
          { key: 'memberCount', labelEn: 'Total Family Members', labelHi: 'परिवार के कुल सदस्य', type: 'number', placeholder: 'e.g. 4', helpTextEn: 'All eligible family members', helpTextHi: 'लाभार्थी सदस्यों की संख्या' },
          { key: 'mobileNumber', labelEn: 'Mobile Number for Ayushman Card', labelHi: 'मोबाइल नंबर', type: 'text', placeholder: '10-digit mobile number', helpTextEn: 'OTP verification number', helpTextHi: 'ओटीपी सत्यापन हेतु' }
        ]
      }
    ]
  },
  {
    id: 'pm-vishwakarma',
    nameEn: 'PM Vishwakarma Scheme',
    nameHi: 'प्रधानमंत्री विश्वकर्मा योजना',
    ministryEn: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    ministryHi: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय',
    category: 'Skill & Artisan',
    benefitAmount: '₹3,00,000 + ₹15,000 Kit',
    benefitFrequency: 'Collateral-free loan @ 5% + Toolkit Grant',
    descriptionEn: 'End-to-end holistic support for traditional artisans and craftspeople: recognized certification, ₹15,000 toolkit grant, up to ₹3 lakh subsidized credit, and digital transaction incentives.',
    descriptionHi: 'पारंपरिक कारीगरों और शिल्पकारों को समग्र सहायता: विश्वकर्मा प्रमाण पत्र, ₹15,000 का टूलकिट अनुदान और 5% रियायती ब्याज दर पर ₹3 लाख तक का ऋण।',
    eligibilityCriteria: {
      minAge: 18,
      targetOccupation: ['Carpenter (Suthar)', 'Blacksmith (Lohar)', 'Potter (Kumhaar)', 'Tailor (Darzi)', 'Cobbler (Charmakar)', 'Mason (Rajmistri)', 'Barber (Naai)', 'Sculptor (Moortikar)', 'Goldsmith (Sonar)', 'Basket Weaver'],
      gender: 'All',
      ruralUrban: 'All',
      specialRequirementsEn: [
        'Artisan working with hands and tools in one of 18 specified trades',
        'Minimum age of 18 on the date of application',
        'Should not have availed similar loans under PMEGP or PM SVANidhi in last 5 years'
      ],
      specialRequirementsHi: [
        'हाथ और औजारों से 18 पारंपरिक शिल्पों में कार्य करने वाला कारीगर',
        'आवेदन तिथि पर न्यूनतम आयु 18 वर्ष',
        'पिछले 5 वर्षों में पीएमईजीपी या पीएम स्वनिधि से ऋण नहीं लिया हो'
      ]
    },
    requiredDocuments: [
      {
        code: 'aadhaar',
        nameEn: 'Aadhaar Card',
        nameHi: 'आधार कार्ड',
        mandatory: true,
        howToObtainEn: 'UIDAI portal',
        howToObtainHi: 'आधार केंद्र'
      },
      {
        code: 'artisan_proof',
        nameEn: 'Trade / Artisan Self-Declaration or Certificate',
        nameHi: 'व्यवसाय / शिल्प स्व-घोषणा या प्रमाण पत्र',
        mandatory: true,
        howToObtainEn: 'Local Gram Panchayat or Urban Local Body / Ward Councilor',
        howToObtainHi: 'ग्राम पंचायत प्रधान या नगर पालिका वार्ड पार्षद से'
      },
      {
        code: 'bank_passbook',
        nameEn: 'Bank Passbook / Cancelled Cheque',
        nameHi: 'बैंक पासबुक / रद्द चेक',
        mandatory: true,
        howToObtainEn: 'Bank branch',
        howToObtainHi: 'बैंक शाखा से'
      }
    ],
    formSteps: [
      {
        stepId: 1,
        titleEn: 'Trade & Artisan Skill',
        titleHi: 'शिल्प व कारीगरी विवरण',
        fields: [
          { key: 'tradeName', labelEn: 'Traditional Trade / Profession', labelHi: 'पारंपरिक शिल्प / व्यवसाय', type: 'select', options: ['Carpenter (सुथार)', 'Blacksmith (लोहार)', 'Potter (कुम्हार)', 'Tailor (दर्जी)', 'Cobbler (चर्मकार)', 'Mason (राजमिस्त्री)', 'Barber (नाई)', 'Sculptor (मूर्तिकार)', 'Goldsmith (सोनार)'], placeholder: 'Select trade', helpTextEn: 'Your active craft occupation', helpTextHi: 'आपका प्राथमिक शिल्प' },
          { key: 'experienceYears', labelEn: 'Years of Experience in Trade', labelHi: 'कार्य अनुभव (वर्ष)', type: 'number', placeholder: 'e.g. 12', helpTextEn: 'Number of years practicing the craft', helpTextHi: 'इस शिल्प में कितने वर्षों का अनुभव है' }
        ]
      },
      {
        stepId: 2,
        titleEn: 'Credit & Toolkit Support',
        titleHi: 'ऋण व टूलकिट सहायता',
        fields: [
          { key: 'toolkitChoice', labelEn: 'Required Modern Toolkit', labelHi: 'आधुनिक टूलकिट चयन (₹15,000 वाउचर)', type: 'text', placeholder: 'e.g. Advanced Woodworking Router & Planer', helpTextEn: 'Tools needed to upgrade craftsmanship', helpTextHi: 'कारीगरी को आधुनिक बनाने हेतु आवश्यक औजार' },
          { key: 'loanAmountNeeded', labelEn: 'Initial Credit Required (INR)', labelHi: 'आवश्यक कार्यशील पूंजी ऋण (₹)', type: 'number', placeholder: 'e.g. 100000', helpTextEn: 'Tranche 1 up to ₹1,00,000 @ 5% interest', helpTextHi: 'प्रथम चरण में ₹1,00,000 तक 5% ब्याज पर' }
        ]
      }
    ]
  },
  {
    id: 'pmay-housing',
    nameEn: 'PM Awas Yojana (PMAY Housing for All)',
    nameHi: 'प्रधानमंत्री आवास योजना (सबके लिए आवास)',
    ministryEn: 'Ministry of Housing and Urban Affairs / MoRD',
    ministryHi: 'आवासन और शहरी कार्य मंत्रालय / ग्रामीण विकास मंत्रालय',
    category: 'Housing',
    benefitAmount: '₹1,20,000 - ₹2,50,000',
    benefitFrequency: 'Direct construction grant into bank account in 3 stages',
    descriptionEn: 'Financial assistance for the construction of a permanent pucca house with basic amenities for homeless and kutcha house dwellers.',
    descriptionHi: 'बेघर और कच्चे मकानों में रहने वाले परिवारों को बुनियादी सुविधाओं से युक्त पक्का मकान बनाने हेतु ₹1.2 लाख से ₹2.5 लाख तक की सीधी आर्थिक सहायता।',
    eligibilityCriteria: {
      minAge: 18,
      maxIncome: 300000,
      gender: 'All',
      ruralUrban: 'All',
      specialRequirementsEn: [
        'Family does not own a pucca house in any part of India',
        'Should not have received earlier central or state housing subsidy',
        'House preferably in the name of the female head or joint ownership'
      ],
      specialRequirementsHi: [
        'परिवार के किसी भी सदस्य के नाम पूरे भारत में कोई पक्का मकान नहीं होना चाहिए',
        'पहले किसी अन्य सरकारी आवास योजना का लाभ न लिया हो',
        'मकान का स्वामित्व परिवार की महिला सदस्य के नाम या संयुक्त होना चाहिए'
      ]
    },
    requiredDocuments: [
      {
        code: 'aadhaar',
        nameEn: 'Aadhaar Card of all family members',
        nameHi: 'परिवार के सभी सदस्यों का आधार कार्ड',
        mandatory: true,
        howToObtainEn: 'UIDAI portal',
        howToObtainHi: 'आधार केंद्र'
      },
      {
        code: 'kutcha_house_photo',
        nameEn: 'Current Kutcha House Geo-tagged Photo',
        nameHi: 'वर्तमान कच्चे मकान का जियो-टैग फोटो',
        mandatory: true,
        howToObtainEn: 'AwasApp mobile inspection by Village Secretary / Gram Sevak',
        howToObtainHi: 'आवास ऐप द्वारा ग्राम सेवक / सचिव के माध्यम से'
      },
      {
        code: 'income_cert',
        nameEn: 'Income Certificate (EWS <= ₹3L)',
        nameHi: 'आय प्रमाण पत्र (EWS श्रेणी)',
        mandatory: true,
        howToObtainEn: 'Tehsil or Revenue department',
        howToObtainHi: 'तहसील कार्यालय'
      },
      {
        code: 'bank_passbook',
        nameEn: 'Bank Passbook (Aadhaar linked)',
        nameHi: 'बैंक पासबुक',
        mandatory: true,
        howToObtainEn: 'Bank branch',
        howToObtainHi: 'बैंक शाखा'
      }
    ],
    formSteps: [
      {
        stepId: 1,
        titleEn: 'Existing Housing Status',
        titleHi: 'वर्तमान आवास की स्थिति',
        fields: [
          { key: 'houseType', labelEn: 'Present House Type', labelHi: 'वर्तमान मकान का प्रकार', type: 'select', options: ['Kutcha (कच्चा/मिट्टी)', 'Thatched Roof (घास-फूस)', 'Homeless (बेघर)', 'Semi-Pucca'], placeholder: 'Select house type', helpTextEn: 'Only kutcha or homeless eligible', helpTextHi: 'केवल कच्चे मकान या बेघर पात्र हैं' },
          { key: 'landOwnershipStatus', labelEn: 'Land Ownership for Construction', labelHi: 'निर्माण हेतु भूमि स्वामित्व', type: 'select', options: ['Own Land (निजी भूमि)', 'Allotted Abadi Plot (आबादी पट्टा)', 'Ancestral Land'], placeholder: 'Select ownership', helpTextEn: 'Land where pucca house will be built', helpTextHi: 'जहाँ पक्का मकान बनेगा' }
        ]
      }
    ]
  },
  {
    id: 'sukanya-samriddhi',
    nameEn: 'Sukanya Samriddhi Yojana (SSY)',
    nameHi: 'सुकन्या समृद्धि योजना',
    ministryEn: 'Ministry of Finance / Dept. of Posts',
    ministryHi: 'वित्त मंत्रालय / डाक विभाग',
    category: 'Women & Child',
    benefitAmount: '8.2% Compound Interest + Tax Free',
    benefitFrequency: 'High interest savings with 80C tax exemption',
    descriptionEn: 'Small deposit scheme for the girl child launched under Beti Bachao Beti Padhao campaign offering government-backed 8.2% interest rate for higher education and marriage.',
    descriptionHi: 'बेटी बचाओ बेटी पढ़ाओ अभियान के तहत बालिकाओं के लिए उच्च ब्याज (8.2%) और आयकर छूट वाली बचत योजना।',
    eligibilityCriteria: {
      maxAge: 10,
      gender: 'Female',
      specialRequirementsEn: [
        'Account can be opened by biological parents or legal guardian for a girl child under 10 years of age',
        'Maximum two accounts permitted per family (three in case of twins/triplets)',
        'Deposit period is 15 years, matures on completion of 21 years from account opening'
      ],
      specialRequirementsHi: [
        '10 वर्ष से कम आयु की बालिका के लिए माता-पिता या कानूनी अभिभावक द्वारा खाता खोला जा सकता है',
        'एक परिवार में अधिकतम दो बालिकाओं के लिए',
        '15 वर्षों तक जमा, 21 वर्ष बाद पूर्ण परिपक्वता'
      ]
    },
    requiredDocuments: [
      {
        code: 'birth_cert',
        nameEn: 'Girl Child Birth Certificate',
        nameHi: 'बालिका का जन्म प्रमाण पत्र',
        mandatory: true,
        howToObtainEn: 'Municipal Corporation or Registrar of Births and Deaths',
        howToObtainHi: 'नगर निगम या जन्म-मृत्यु रजिस्ट्रार कार्यालय से'
      },
      {
        code: 'parent_aadhaar',
        nameEn: 'Parent / Guardian Aadhaar & PAN Card',
        nameHi: 'माता-पिता / अभिभावक का आधार व पैन कार्ड',
        mandatory: true,
        howToObtainEn: 'UIDAI / NSDL portals',
        howToObtainHi: 'आधार व आयकर विभाग'
      }
    ],
    formSteps: [
      {
        stepId: 1,
        titleEn: 'Girl Child Details',
        titleHi: 'बालिका का विवरण',
        fields: [
          { key: 'childName', labelEn: 'Girl Child Name', labelHi: 'बालिका का नाम', type: 'text', placeholder: 'e.g. Ananya Sharma', helpTextEn: 'Name as on birth certificate', helpTextHi: 'जन्म प्रमाण पत्र अनुसार नाम' },
          { key: 'childDob', labelEn: 'Date of Birth', labelHi: 'जन्म तिथि', type: 'date', placeholder: 'YYYY-MM-DD', helpTextEn: 'Must be under 10 years of age', helpTextHi: '10 वर्ष से कम होनी चाहिए' },
          { key: 'initialDeposit', labelEn: 'Initial Deposit Amount (Min ₹250)', labelHi: 'प्रारंभिक जमा राशि (न्यूनतम ₹250)', type: 'number', placeholder: 'e.g. 1000', helpTextEn: 'Annual deposit up to ₹1,50,000', helpTextHi: 'प्रति वर्ष अधिकतम ₹1.5 लाख तक' }
        ]
      }
    ]
  },
  {
    id: 'atal-pension',
    nameEn: 'Atal Pension Yojana (APY)',
    nameHi: 'अटल पेंशन योजना',
    ministryEn: 'Ministry of Finance / PFRDA',
    ministryHi: 'वित्त मंत्रालय / पीएफआरडीए',
    category: 'Pension',
    benefitAmount: '₹1,000 - ₹5,000 / month',
    benefitFrequency: 'Guaranteed lifetime monthly pension after age 60',
    descriptionEn: 'Government guaranteed pension scheme primarily targeted at unorganized sector workers ensuring predictable monthly pension post-retirement.',
    descriptionHi: 'असंगठित क्षेत्र के कामगारों हेतु 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 तक की निश्चित आजीवन मासिक पेंशन।',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 40,
      gender: 'All',
      specialRequirementsEn: [
        'Citizen between 18 and 40 years old',
        'Must possess a savings bank account',
        'Should not be an income tax payer (as per revised guidelines)'
      ],
      specialRequirementsHi: [
        '18 से 40 वर्ष की आयु के भारतीय नागरिक',
        'बचत बैंक खाता अनिवार्य',
        'आयकर दाता नहीं होना चाहिए'
      ]
    },
    requiredDocuments: [
      {
        code: 'aadhaar',
        nameEn: 'Aadhaar Card',
        nameHi: 'आधार कार्ड',
        mandatory: true,
        howToObtainEn: 'UIDAI',
        howToObtainHi: 'आधार केंद्र'
      },
      {
        code: 'bank_passbook',
        nameEn: 'Savings Bank Account with Auto-Debit',
        nameHi: 'बचत बैंक खाता (ऑटो-डेबिट सुविधा)',
        mandatory: true,
        howToObtainEn: 'Bank or Post Office branch',
        howToObtainHi: 'बैंक या डाकघर शाखा'
      }
    ],
    formSteps: [
      {
        stepId: 1,
        titleEn: 'Pension Choice & Contribution',
        titleHi: 'पेंशन विकल्प व अंशदान',
        fields: [
          { key: 'pensionTier', labelEn: 'Desired Monthly Pension at 60', labelHi: 'इच्छित मासिक पेंशन (60 वर्ष उपरांत)', type: 'select', options: ['₹1,000 / Month', '₹2,000 / Month', '₹3,000 / Month', '₹5,000 / Month'], placeholder: 'Select tier', helpTextEn: 'Contribution is calculated based on current age', helpTextHi: 'वर्तमान आयु के आधार पर मासिक किस्त तय होगी' },
          { key: 'nomineeName', labelEn: 'Nominee Name', labelHi: 'नॉमिनी का नाम', type: 'text', placeholder: 'e.g. Spouse / Child', helpTextEn: 'Person entitled to pension corpus in case of demise', helpTextHi: 'अप्रिय घटना की स्थिति में हकदार' }
        ]
      }
    ]
  }
];
