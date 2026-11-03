export interface ParsedKycData {
  documentType: 'Aadhaar Card' | 'Land Record (7/12 / Khasra)' | 'Ration Card (BPL/Antyodaya)' | 'Income Certificate' | 'Artisan / Trade Certificate' | 'Bank Passbook';
  documentNumber: string;
  fullName: string;
  fatherOrSpouseName?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  state: string;
  district: string;
  addressLine: string;
  annualIncome?: number;
  landHoldingAcres?: number;
  khasraPlotNo?: string;
  occupation?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  npciStatus?: 'Seeded / Active' | 'Pending' | 'Not Linked';
  confidenceScore: number;
  rawOcrSnippet?: string;
}

export interface SampleKycDoc {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  descriptionEn: string;
  descriptionHi: string;
  parsedData: ParsedKycData;
}

export const SAMPLE_KYC_DOCS: SampleKycDoc[] = [
  {
    id: 'sample-farmer-aadhaar-land',
    titleEn: 'Ramesh Kumar (Small Farmer, 1.8 Acres)',
    titleHi: 'रमेश कुमार (लघु किसान, 1.8 एकड़)',
    category: 'Farmer / PM-Kisan & APY Eligible',
    descriptionEn: 'Aadhaar + Uttar Pradesh Bhulekh Khasra record with 1.8 acres cultivable land.',
    descriptionHi: 'आधार कार्ड + उत्तर प्रदेश भूलेख खसरा रिकॉर्ड (1.8 एकड़ कृषि भूमि)।',
    parsedData: {
      documentType: 'Land Record (7/12 / Khasra)',
      documentNumber: 'KH-UP-2024-9182',
      fullName: 'Ramesh Kumar',
      fatherOrSpouseName: 'Ramprasad Kumar',
      dateOfBirth: '1982-05-14',
      age: 42,
      gender: 'Male',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      addressLine: 'Village Shivpur, Post Pindra, Varanasi, UP - 221002',
      annualIncome: 95000,
      landHoldingAcres: 1.8,
      khasraPlotNo: '142/3B',
      occupation: 'Farmer',
      bankAccountNo: '918237461928',
      ifscCode: 'SBIN0001234',
      npciStatus: 'Seeded / Active',
      confidenceScore: 0.96,
      rawOcrSnippet: 'भारत सरकार / GOVERNMENT OF INDIA | नाम: रमेश कुमार | पिता: रामप्रसाद | भूलेख खसरा सं: 142/3B | रकबा: 0.7280 हे. (1.8 एकड़) | जनपद: वाराणसी'
    }
  },
  {
    id: 'sample-artisan-vishwakarma',
    titleEn: 'Mohammad Rafiq (Master Carpenter, 14 Yrs)',
    titleHi: 'मोहम्मद रफीक (काष्ठशिल्पी / बढ़ई, 14 वर्ष)',
    category: 'Artisan / PM Vishwakarma Eligible',
    descriptionEn: 'Aadhaar + Gram Panchayat Artisan Declaration for Traditional Woodworking.',
    descriptionHi: 'आधार कार्ड + ग्राम पंचायत काष्ठशिल्प स्व-प्रमाण पत्र।',
    parsedData: {
      documentType: 'Artisan / Trade Certificate',
      documentNumber: 'VIS-MP-2023-7412',
      fullName: 'Mohammad Rafiq',
      fatherOrSpouseName: 'Abdul Sattar',
      dateOfBirth: '1987-11-20',
      age: 37,
      gender: 'Male',
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      addressLine: 'House 42, Ward 18, Karond Road, Bhopal, MP - 462038',
      annualIncome: 140000,
      occupation: 'Carpenter (Suthar)',
      bankAccountNo: '501004928172',
      ifscCode: 'PUNB0182700',
      npciStatus: 'Seeded / Active',
      confidenceScore: 0.94,
      rawOcrSnippet: 'विश्वकर्मा पंजीकरण स्व-प्रमाणन | नाम: मोहम्मद रफीक | शिल्प: बढ़ई (काष्ठशिल्प) | कार्य अनुभव: 14 वर्ष | औजार सहायता: आवश्यक | भोपाल, म.प्र.'
    }
  },
  {
    id: 'sample-bpl-mother-ssy-pmjay',
    titleEn: 'Sunita Devi (BPL Household, Girl Child 6 Yrs)',
    titleHi: 'सुनीता देवी (अंत्योदय बीपीएल परिवार, 6 वर्ष बालिका)',
    category: 'BPL / Ayushman & Sukanya Eligible',
    descriptionEn: 'Antyodaya Ration Card + Birth Certificate for daughter Ananya (age 6).',
    descriptionHi: 'अंत्योदय राशन कार्ड + 6 वर्षीय पुत्री अनन्या का जन्म प्रमाण पत्र।',
    parsedData: {
      documentType: 'Ration Card (BPL/Antyodaya)',
      documentNumber: 'RC-BPL-MH-449102',
      fullName: 'Sunita Devi',
      fatherOrSpouseName: 'Vijay Pandurang',
      dateOfBirth: '1991-03-08',
      age: 33,
      gender: 'Female',
      state: 'Maharashtra',
      district: 'Nashik',
      addressLine: 'Ganesh Nagar, Post Dindori, Nashik, MH - 422202',
      annualIncome: 72000,
      occupation: 'Agricultural Laborer',
      bankAccountNo: '319200109281',
      ifscCode: 'BOI0002019',
      npciStatus: 'Seeded / Active',
      confidenceScore: 0.97,
      rawOcrSnippet: 'राष्ट्रीय खाद्य सुरक्षा योजना | अंत्योदय अन्न योजना राशन कार्ड | मुख्य धारक: सुनीता देवी | पारिवारिक वार्षिक आय: ₹72,000 | सदस्य: 4 (बालिका: अनन्या, जन्म 2018)'
    }
  }
];
