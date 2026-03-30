const translations = {
  en: {
    // ── Common ──────────────────────────────────────────────────────────────
    back: "Back",
    next: "Next",
    submit: "Submit",
    log_out: "Log Out",
    yes: "Yes",
    no: "No",
    male: "Male",
    female: "Female",
    description_placeholder: "Description",
    other: "Other",

    // ── FunderLogo ───────────────────────────────────────────────────────────
    funder_text:
      "The IMED Connect project is funded by the Finnish Embassy.",

    // ── Auth shared ──────────────────────────────────────────────────────────
    app_tagline: "Also available on android and ios.",
    phone_number: "Phone number",
    password: "Password",
    sign_in: "Sign In",
    register: "Register",

    // ── Sign-in page ─────────────────────────────────────────────────────────
    signin_subtitle: "Sign In",
    forgot_password: "Forgot password?",
    not_a_member: "Not a member?",
    signin_error_fill: "Please fill everything!",
    signin_error_credentials: "Incorrect credentials!",

    // ── Register page ────────────────────────────────────────────────────────
    register_subtitle: "Register",
    your_name: "Your name",
    register_btn: "Register Now",
    already_member: "Already a member?",
    register_error_name: "Enter your full name!",
    register_error_phone: "Enter a valid phone number!",
    register_error_phone_zero: "Phone shouldn't start with 0!",
    register_error_password: "Enter a strong password!",
    register_error_phone_in_use: "Phone number already in use.",
    register_error_generic: "Error! Check and try again.",

    // ── Reset page ───────────────────────────────────────────────────────────
    reset_subtitle: "Reset password",
    six_digits_code: "Six digits code",
    send_otp: "Send OTP",
    ready_to_continue: "Ready to continue?",
    reset_error_phone: "Enter valid phone number!",
    reset_error_wrong_code: "Wrong code",

    // ── Step 2 — shared by StudentStepTwo and MentorStepTwo ─────────────────
    step2_heading: "Tell us about you!",
    step2_dob_question: "What is your date of birth?",
    step2_sex_question: "Please tell us your sex.",
    step2_alt_phone_label: "Your alternative phone number",
    step2_alt_phone_placeholder: "Eg: 255** *** ***",
    step2_email_label: "Your email address",
    step2_email_placeholder: "Email address",
    step2_error_dob: "Please enter a valid date of birth",
    step2_error_sex: "Please select your sex",
    step2_error_phone: "Please enter a valid phone number.",
    step2_error_email: "Please enter a valid email address.",

    // ── Marital status chips ─────────────────────────────────────────────────
    marital_single: "Single",
    marital_married: "Married",
    marital_separated: "Separated",
    marital_widowed: "Widowed",

    // ── Student Step 3 ───────────────────────────────────────────────────────
    student_step3_heading: "Tell us more!",
    student_step3_marital_question: "What is your marital status?",
    student_step3_location_question: "Please tell us your location.",
    student_step3_location_placeholder: "Eg: Dar Es Salaam, Kinondoni",
    student_step3_error_marital: "Please select your marital status",
    student_step3_error_location: "Please enter a valid location",

    // ── Student Step 4 ───────────────────────────────────────────────────────
    student_step4_heading: "Tell us your education.",
    student_step4_level_question: "What's your highest level of education?",
    student_step4_level_label: "Your highest level of education?",
    student_step4_course_question:
      "Course or program for your highest education level?",
    student_step4_course_placeholder: "Eg: Bachelor Degree in Linguistic",
    student_step4_institution_question:
      "Name of the institution for your highest education level?",
    student_step4_institution_placeholder: "Eg: University Of Dar Es Salaam",
    student_step4_year_question: "Which year did you graduate?",
    student_step4_error_field: "Please enter field of study",
    student_step4_error_institution: "Please enter a valid institution",
    student_step4_error_year: "Please select graduation year",

    // ── Student Step 5 ───────────────────────────────────────────────────────
    student_step5_heading: "Tell us your preference.",
    student_step5_sector_question:
      "Which sector do you prefer to specialize in your career endeavors?",
    student_step5_timing_question:
      "What is your most preferred timing for providing mentorship support to the beneficiaries? ( pick option you mostly prefer )",
    student_step5_device_question:
      "Which devices do you use to access online information?",
    student_step5_error_device: "Please select device.",

    // ── Sector chips (StudentStepFive) ───────────────────────────────────────
    sector_agriculture: "Agriculture, Agribusiness or Agro-processing",
    sector_transport: "Transport and Logistics",
    sector_tourism: "Tourism and Hospitality",
    sector_construction: "Construction",
    sector_ict: "Information and Communication Technology",
    sector_agroforestry: "Agroforestry",
    sector_energy: "Energy",
    sector_other: "Other",

    // ── Device chips ─────────────────────────────────────────────────────────
    device_smartphone: "Smartphone",
    device_computer: "Computer",
    device_tablet: "Tablet",
    device_none: "None",

    // ── Timing checkboxes ────────────────────────────────────────────────────
    timing_anytime: "Anytime during working hours",
    timing_morning_weekday: "Morning on weekdays",
    timing_afternoon_weekday: "Afternoon on weekdays",
    timing_evening_weekday: "Evening on weekdays",
    timing_morning_weekend: "Morning on weekends",
    timing_afternoon_weekend: "Afternoon on weekends",
    timing_evening_weekend: "Evening on weekends",

    // ── Mentor Step 3 ────────────────────────────────────────────────────────
    mentor_step3_heading: "Tell us more!",
    mentor_step3_level_question: "What's your highest level of education?",
    mentor_step3_level_label: "Your highest level of education?",
    mentor_step3_field_question: "What is your highest field of study?",
    mentor_step3_field_placeholder: "Eg: Bachelor Degree in Linguistic",
    mentor_step3_location_question: "Please tell us your location.",
    mentor_step3_location_placeholder: "Eg: Dar Es Salaam, Kinondoni",
    mentor_step3_error_field: "Please enter field of study",
    mentor_step3_error_location: "Please enter a valid location",

    // ── Mentor Step 4 ────────────────────────────────────────────────────────
    mentor_step4_heading: "Tell us about your skills.",
    mentor_step4_training_question:
      "Have you attended any professional training in coaching and mentorship skills? If yes, please describe the details.",
    mentor_step4_training_detail_label:
      "Provide details of the training ( course, award, year)",
    mentor_step4_experience_question:
      "Do you have any experience in business or career coaching? If Yes, please indicate for how long and in what areas.",
    mentor_step4_experience_detail_label:
      "Please describe your experience and the area of experience.",
    mentor_step4_error_training: "Please select training status",
    mentor_step4_error_training_detail: "Please detail the training",
    mentor_step4_error_experience: "Please select experience status",
    mentor_step4_error_experience_detail: "Please detail your experience",

    // ── Mentor Step 5 ────────────────────────────────────────────────────────
    mentor_step5_heading: "Tell us your preferences.",
    mentor_step5_interest_question:
      "Select major  areas of interest in coaching and mentorship",
    mentor_step5_expertise_question:
      "Select specific areas  of expertise (Tick all that apply)",
    mentor_step5_number_question:
      "How many mentees can you handle efficiently in a given time?",
    mentor_step5_timing_question:
      "What is your most preferred timing for providing mentorship support to the beneficiaries? ( pick option you mostly prefer )",
    mentor_step5_error_expertise:
      "Please select atleast one area of expertise.",

    // ── Mentor interests ─────────────────────────────────────────────────────
    interest_business: "Business Development and Entrepreneurship",
    interest_career: "Early Career Development and Counselling",
    interest_both: "Both areas",

    // ── Mentor mentee count ──────────────────────────────────────────────────
    mentee_one: "Just one",
    mentee_2_5: "2 - 5",
    mentee_5_10: "5 - 10",
    mentee_10_20: "10 - 20",
    mentee_20_50: "20 - 50",
    mentee_50_plus: "50 and above",

    // ── Expertise areas (Mentor Step 5) ──────────────────────────────────────
    expertise_entrepreneurship: "Entrepreneurship development",
    expertise_finance: "Financial management and literacy",
    expertise_investor: "Investor readiness",
    expertise_biz_mgmt: "Business Management Strategy and Governance",
    expertise_biz_model: "Business Modelling and Design thinking",
    expertise_job_search: "Job searching skills",
    expertise_marketing: "Marketing and selling skills",
    expertise_online_gigs: "Online Gigs and Remote jobs",
    expertise_communication: "Communication and Relationship building",
    expertise_fundraising: "Fundraising and resource mobilization",
    expertise_digital: "Digital Skills",
    expertise_innovation: "Innovation Management",
    expertise_other: "Other",

    // ── Entrepreneur Step 3 ──────────────────────────────────────────────────
    ent_step3_heading: "Tell us about your business.",
    ent_step3_subtitle:
      "Help us understand your work so we can connect you with the right support.",
    ent_step3_biz_name_label: "Business name (if applicable)",
    ent_step3_biz_name_placeholder: "Eg: Kilimo Fresh Ltd",
    ent_step3_sector_label: "Type of business / sector",
    ent_step3_value_chain_question:
      "Which agricultural value chain do you work with?",
    ent_step3_activity_label:
      "Main activity / core business — describe your main product or service",
    ent_step3_activity_placeholder:
      "Eg: Selling fresh vegetables directly to households in Dar es Salaam",
    ent_step3_formalization_label: "Is your business formalized / registered?",
    ent_step3_years_label: "Years of business operation",
    ent_step3_region_label: "Region where your business operates",
    ent_step3_region_placeholder: "Eg: Arusha",
    ent_step3_district_label: "District where your business operates",
    ent_step3_district_placeholder: "Eg: Arumeru",
    ent_step3_error_sector: "Please select your type of business.",
    ent_step3_error_activity:
      "Please describe your main business activity (at least 10 characters).",
    ent_step3_error_formalization:
      "Please select your business formalization status.",
    ent_step3_error_region: "Please enter your business region.",
    ent_step3_error_district: "Please enter your business district.",
    ent_step3_error_generic: "Something went wrong. Please try again.",

    // ── Entrepreneur sectors ─────────────────────────────────────────────────
    ent_sector_agriculture: "Agriculture",
    ent_sector_livestock: "Livestock",
    ent_sector_fishing: "Fishing",
    ent_sector_processing: "Processing",
    ent_sector_services: "Services",
    ent_sector_trade: "Trade",
    ent_sector_other: "Other",

    // ── Agricultural value chains ────────────────────────────────────────────
    vc_maize: "Maize",
    vc_rice: "Rice",
    vc_sunflower: "Sunflower",
    vc_horticulture: "Horticulture (vegetables & fruits)",
    vc_poultry: "Poultry",
    vc_livestock: "Animal Keeping (livestock)",
    vc_cassava: "Cassava",
    vc_beans: "Beans",
    vc_other: "Other",

    // ── Formalization options ────────────────────────────────────────────────
    form_not_registered: "Not registered",
    form_brela: "Registered through BRELA",
    form_other: "Other Registrations (e.g. local authority, cooperative)",
    form_no_business: "I have no business",

    // ── Years of operation ───────────────────────────────────────────────────
    years_less_1: "Less than 1 year",
    years_1_3: "1–3 years",
    years_4_5: "4–5 years",
    years_more_5: "More than 5 years",

    // ── Entrepreneur Step 4 ──────────────────────────────────────────────────
    ent_step4_heading: "Your Business Details",
    ent_step4_subtitle:
      "This information helps us tailor support and resources to your specific needs. All information remains confidential.",
    ent_step4_employees_label: "Number of employees (including yourself)",
    ent_step4_employees_placeholder: "Eg: 3",
    ent_step4_revenue_label: "Average monthly revenue (in TZS)",
    ent_step4_challenges_label:
      "Main challenges currently facing your business (select all that apply)",
    ent_step4_support_received_label:
      "Have you received any business training or support before?",
    ent_step4_support_org_label: "From which organisation or project?",
    ent_step4_support_org_placeholder: "Eg: TangaYetu, AGRA",
    ent_step4_support_needed_label:
      "What kind of support are you looking for from IMED Connect? (select all that apply)",
    ent_step4_tin_label: "TIN / Business Registration Number (optional)",
    ent_step4_tin_placeholder: "Eg: 123-456-789",
    ent_step4_disability_label: "Do you have any form of disability?",
    ent_step4_disability_desc_label: "Please describe your disability",
    ent_step4_disability_desc_placeholder: "Describe",
    ent_step4_error_employees: "Please enter the number of employees.",
    ent_step4_error_challenges: "Please select at least one main challenge.",
    ent_step4_error_support:
      "Please indicate whether you have received business support before.",
    ent_step4_error_support_org:
      "Please name the organisation or project that provided support.",
    ent_step4_error_support_needed:
      "Please select at least one type of support you are looking for.",
    ent_step4_error_disability:
      "Please indicate whether you have any form of disability.",
    ent_step4_error_disability_desc: "Please describe your disability.",
    ent_step4_error_generic: "Something went wrong. Please try again.",

    // ── Revenue ranges ───────────────────────────────────────────────────────
    revenue_below_500k: "Below TZS 500,000",
    revenue_500k_2m: "TZS 500,001 – 2,000,000",
    revenue_2m_5m: "TZS 2,000,001 – 5,000,000",
    revenue_above_5m: "Above TZS 5,000,000",

    // ── Business challenges ──────────────────────────────────────────────────
    challenge_finance: "Access to finance",
    challenge_markets: "Markets",
    challenge_skills: "Skills",
    challenge_technology: "Technology",
    challenge_regulations: "Regulations",
    challenge_climate: "Climate change",
    challenge_other: "Other",

    // ── Support types ────────────────────────────────────────────────────────
    support_training: "Business training",
    support_mentorship: "Mentorship",
    support_market: "Market linkages",
    support_finance: "Access to finance",
    support_networking: "Networking",
    support_other: "Other",
  },

  sw: {
    // ── Common ──────────────────────────────────────────────────────────────
    back: "Rudi",
    next: "Endelea",
    submit: "Wasilisha",
    log_out: "Toka",
    yes: "Ndiyo",
    no: "Hapana",
    male: "Mme",
    female: "Mke",
    description_placeholder: "Maelezo",
    other: "Nyingine",

    // ── FunderLogo ───────────────────────────────────────────────────────────
    funder_text:
      "Mradi wa IMED Connect unafadhiliwa na Ubalozi wa Finland.",

    // ── Auth shared ──────────────────────────────────────────────────────────
    app_tagline: "Inapatikana pia kwenye android na ios.",
    phone_number: "Nambari ya simu",
    password: "Nenosiri",
    sign_in: "Ingia",
    register: "Jiandikishe",

    // ── Sign-in page ─────────────────────────────────────────────────────────
    signin_subtitle: "Ingia",
    forgot_password: "Umesahau nenosiri?",
    not_a_member: "Bado si mwanachama?",
    signin_error_fill: "Tafadhali jaza kila kitu!",
    signin_error_credentials: "Taarifa za kuingia si sahihi!",

    // ── Register page ────────────────────────────────────────────────────────
    register_subtitle: "Jiandikishe",
    your_name: "Jina lako",
    register_btn: "Jiandikishe Sasa",
    already_member: "Tayari ni mwanachama?",
    register_error_name: "Weka jina lako kamili!",
    register_error_phone: "Weka nambari sahihi ya simu!",
    register_error_phone_zero: "Nambari ya simu isianze na 0!",
    register_error_password: "Weka nenosiri imara!",
    register_error_phone_in_use: "Nambari ya simu tayari inatumika.",
    register_error_generic: "Hitilafu! Angalia na jaribu tena.",

    // ── Reset page ───────────────────────────────────────────────────────────
    reset_subtitle: "Weka upya nenosiri",
    six_digits_code: "Msimbo wa nambari sita",
    send_otp: "Tuma OTP",
    ready_to_continue: "Uko tayari kuendelea?",
    reset_error_phone: "Weka nambari sahihi ya simu!",
    reset_error_wrong_code: "Msimbo usio sahihi",

    // ── Step 2 ───────────────────────────────────────────────────────────────
    step2_heading: "Tuambie kuhusu wewe!",
    step2_dob_question: "Tarehe yako ya kuzaliwa ni nini?",
    step2_sex_question: "Tafadhali tuambie jinsia yako.",
    step2_alt_phone_label: "Nambari yako mbadala ya simu",
    step2_alt_phone_placeholder: "Mfano: 255** *** ***",
    step2_email_label: "Anwani yako ya barua pepe",
    step2_email_placeholder: "Anwani ya barua pepe",
    step2_error_dob: "Tafadhali weka tarehe sahihi ya kuzaliwa",
    step2_error_sex: "Tafadhali chagua jinsia yako",
    step2_error_phone: "Tafadhali weka nambari sahihi ya simu.",
    step2_error_email: "Tafadhali weka anwani sahihi ya barua pepe.",

    // ── Marital status chips ─────────────────────────────────────────────────
    marital_single: "Mseja",
    marital_married: "Mwenye ndoa",
    marital_separated: "Ametengana",
    marital_widowed: "Mjane",

    // ── Student Step 3 ───────────────────────────────────────────────────────
    student_step3_heading: "Tuambie zaidi!",
    student_step3_marital_question: "Hali yako ya ndoa ni nini?",
    student_step3_location_question: "Tafadhali tuambie mahali ulipo.",
    student_step3_location_placeholder: "Mfano: Dar Es Salaam, Kinondoni",
    student_step3_error_marital: "Tafadhali chagua hali yako ya ndoa",
    student_step3_error_location: "Tafadhali weka mahali sahihi",

    // ── Student Step 4 ───────────────────────────────────────────────────────
    student_step4_heading: "Tuambie elimu yako.",
    student_step4_level_question:
      "Kiwango chako cha juu zaidi cha elimu ni nini?",
    student_step4_level_label: "Kiwango chako cha juu zaidi cha elimu?",
    student_step4_course_question:
      "Kozi au programu ya kiwango chako cha juu zaidi cha elimu?",
    student_step4_course_placeholder: "Mfano: Shahada ya Kwanza ya Isimu",
    student_step4_institution_question:
      "Jina la taasisi ya kiwango chako cha juu zaidi cha elimu?",
    student_step4_institution_placeholder:
      "Mfano: Chuo Kikuu cha Dar Es Salaam",
    student_step4_year_question: "Ulihitimu mwaka gani?",
    student_step4_error_field: "Tafadhali weka uwanja wa masomo",
    student_step4_error_institution: "Tafadhali weka taasisi sahihi",
    student_step4_error_year: "Tafadhali chagua mwaka wa kuhitimu",

    // ── Student Step 5 ───────────────────────────────────────────────────────
    student_step5_heading: "Tuambie mapendeleo yako.",
    student_step5_sector_question:
      "Unapendelea kufanya kazi katika sekta gani?",
    student_step5_timing_question:
      "Muda gani unaofaa zaidi kwako kupata msaada wa ushauri? ( chagua unaopendelea zaidi )",
    student_step5_device_question:
      "Unatumia vifaa gani kupata taarifa mtandaoni?",
    student_step5_error_device: "Tafadhali chagua kifaa.",

    // ── Sector chips ─────────────────────────────────────────────────────────
    sector_agriculture: "Kilimo, Biashara ya Kilimo au Usindikaji",
    sector_transport: "Usafiri na Usafirishaji",
    sector_tourism: "Utalii na Ukarimu",
    sector_construction: "Ujenzi",
    sector_ict: "Teknolojia ya Habari na Mawasiliano",
    sector_agroforestry: "Kilimo Misitu",
    sector_energy: "Nishati",
    sector_other: "Nyingine",

    // ── Device chips ─────────────────────────────────────────────────────────
    device_smartphone: "Simu ya kisasa",
    device_computer: "Kompyuta",
    device_tablet: "Kompyuta kibao",
    device_none: "Hakuna",

    // ── Timing checkboxes ────────────────────────────────────────────────────
    timing_anytime: "Wakati wowote wa saa za kazi",
    timing_morning_weekday: "Asubuhi siku za kazi",
    timing_afternoon_weekday: "Mchana siku za kazi",
    timing_evening_weekday: "Jioni siku za kazi",
    timing_morning_weekend: "Asubuhi wikendi",
    timing_afternoon_weekend: "Mchana wikendi",
    timing_evening_weekend: "Jioni wikendi",

    // ── Mentor Step 3 ────────────────────────────────────────────────────────
    mentor_step3_heading: "Tuambie zaidi!",
    mentor_step3_level_question:
      "Kiwango chako cha juu zaidi cha elimu ni nini?",
    mentor_step3_level_label: "Kiwango chako cha juu zaidi cha elimu?",
    mentor_step3_field_question: "Uwanja wako wa juu zaidi wa masomo ni nini?",
    mentor_step3_field_placeholder: "Mfano: Shahada ya Kwanza ya Isimu",
    mentor_step3_location_question: "Tafadhali tuambie mahali ulipo.",
    mentor_step3_location_placeholder: "Mfano: Dar Es Salaam, Kinondoni",
    mentor_step3_error_field: "Tafadhali weka uwanja wa masomo",
    mentor_step3_error_location: "Tafadhali weka mahali sahihi",

    // ── Mentor Step 4 ────────────────────────────────────────────────────────
    mentor_step4_heading: "Tuambie kuhusu ujuzi wako.",
    mentor_step4_training_question:
      "Je, umewahi kupata mafunzo ya kitaalamu ya ukocha na ushauri? Kama ndiyo, tafadhali eleza maelezo.",
    mentor_step4_training_detail_label:
      "Toa maelezo ya mafunzo ( kozi, tuzo, mwaka)",
    mentor_step4_experience_question:
      "Je, una uzoefu wowote katika ukocha wa biashara au kazi? Kama ndiyo, onyesha kwa muda gani na katika maeneo gani.",
    mentor_step4_experience_detail_label:
      "Tafadhali eleza uzoefu wako na eneo la uzoefu.",
    mentor_step4_error_training: "Tafadhali chagua hali ya mafunzo",
    mentor_step4_error_training_detail: "Tafadhali eleza mafunzo",
    mentor_step4_error_experience: "Tafadhali chagua hali ya uzoefu",
    mentor_step4_error_experience_detail: "Tafadhali eleza uzoefu wako",

    // ── Mentor Step 5 ────────────────────────────────────────────────────────
    mentor_step5_heading: "Tuambie mapendeleo yako.",
    mentor_step5_interest_question:
      "Chagua maeneo makuu ya kupenda katika ukocha na ushauri",
    mentor_step5_expertise_question:
      "Chagua maeneo mahususi ya utaalamu (Weka alama zote zinazofaa)",
    mentor_step5_number_question:
      "Unaweza kushughulikia wanafunzi wangapi kwa ufanisi kwa wakati fulani?",
    mentor_step5_timing_question:
      "Muda gani unaofaa zaidi kwako kutoa msaada wa ushauri kwa wanufaika? ( chagua unaopendelea zaidi )",
    mentor_step5_error_expertise:
      "Tafadhali chagua angalau eneo moja la utaalamu.",

    // ── Mentor interests ─────────────────────────────────────────────────────
    interest_business: "Maendeleo ya Biashara na Ujasiriamali",
    interest_career: "Maendeleo ya Awali ya Kazi na Ushauri",
    interest_both: "Maeneo yote mawili",

    // ── Mentor mentee count ──────────────────────────────────────────────────
    mentee_one: "Mmoja tu",
    mentee_2_5: "2 - 5",
    mentee_5_10: "5 - 10",
    mentee_10_20: "10 - 20",
    mentee_20_50: "20 - 50",
    mentee_50_plus: "50 na zaidi",

    // ── Expertise areas ──────────────────────────────────────────────────────
    expertise_entrepreneurship: "Maendeleo ya Ujasiriamali",
    expertise_finance: "Usimamizi wa Fedha na Elimu ya Fedha",
    expertise_investor: "Utayari wa Mwekezaji",
    expertise_biz_mgmt: "Mkakati wa Usimamizi wa Biashara na Utawala",
    expertise_biz_model: "Ubunifu wa Biashara na Fikra za Muundo",
    expertise_job_search: "Ujuzi wa Kutafuta Kazi",
    expertise_marketing: "Ujuzi wa Masoko na Mauzo",
    expertise_online_gigs: "Kazi za Mtandaoni na Kazi za Mbali",
    expertise_communication: "Mawasiliano na Kujenga Mahusiano",
    expertise_fundraising: "Uchangishaji na Uhamasishaji wa Rasilimali",
    expertise_digital: "Ujuzi wa Kidijitali",
    expertise_innovation: "Usimamizi wa Uvumbuzi",
    expertise_other: "Nyingine",

    // ── Entrepreneur Step 3 ──────────────────────────────────────────────────
    ent_step3_heading: "Tuambie kuhusu biashara yako.",
    ent_step3_subtitle:
      "Tusaidie kuelewa kazi yako ili tuweze kukuunganisha na msaada unaofaa.",
    ent_step3_biz_name_label: "Jina la biashara (kama inatumika)",
    ent_step3_biz_name_placeholder: "Mfano: Kilimo Fresh Ltd",
    ent_step3_sector_label: "Aina ya biashara / sekta",
    ent_step3_value_chain_question:
      "Unafanya kazi na mnyororo gani wa thamani wa kilimo?",
    ent_step3_activity_label:
      "Shughuli kuu / biashara kuu — eleza bidhaa au huduma yako kuu",
    ent_step3_activity_placeholder:
      "Mfano: Kuuza mboga mbichi moja kwa moja kwa kaya huko Dar es Salaam",
    ent_step3_formalization_label: "Je, biashara yako ina usajili rasmi?",
    ent_step3_years_label: "Miaka ya uendeshaji wa biashara",
    ent_step3_region_label: "Mkoa ambapo biashara yako inafanya kazi",
    ent_step3_region_placeholder: "Mfano: Arusha",
    ent_step3_district_label: "Wilaya ambapo biashara yako inafanya kazi",
    ent_step3_district_placeholder: "Mfano: Arumeru",
    ent_step3_error_sector: "Tafadhali chagua aina yako ya biashara.",
    ent_step3_error_activity:
      "Tafadhali eleza shughuli yako kuu ya biashara (angalau herufi 10).",
    ent_step3_error_formalization:
      "Tafadhali chagua hali ya usajili wa biashara yako.",
    ent_step3_error_region: "Tafadhali weka mkoa wa biashara yako.",
    ent_step3_error_district: "Tafadhali weka wilaya ya biashara yako.",
    ent_step3_error_generic: "Kuna hitilafu. Tafadhali jaribu tena.",

    // ── Entrepreneur sectors ─────────────────────────────────────────────────
    ent_sector_agriculture: "Kilimo",
    ent_sector_livestock: "Mifugo",
    ent_sector_fishing: "Uvuvi",
    ent_sector_processing: "Usindikaji",
    ent_sector_services: "Huduma",
    ent_sector_trade: "Biashara",
    ent_sector_other: "Nyingine",

    // ── Agricultural value chains ────────────────────────────────────────────
    vc_maize: "Mahindi",
    vc_rice: "Mchele",
    vc_sunflower: "Alizeti",
    vc_horticulture: "Bustani (mboga na matunda)",
    vc_poultry: "Kuku",
    vc_livestock: "Ufugaji (mifugo)",
    vc_cassava: "Muhogo",
    vc_beans: "Maharagwe",
    vc_other: "Nyingine",

    // ── Formalization options ────────────────────────────────────────────────
    form_not_registered: "Haijasajiliwa",
    form_brela: "Imesajiliwa kupitia BRELA",
    form_other: "Usajili mwingine (mfano: mamlaka ya mtaa, ushirika)",
    form_no_business: "Sina biashara",

    // ── Years of operation ───────────────────────────────────────────────────
    years_less_1: "Chini ya mwaka 1",
    years_1_3: "Miaka 1–3",
    years_4_5: "Miaka 4–5",
    years_more_5: "Zaidi ya miaka 5",

    // ── Entrepreneur Step 4 ──────────────────────────────────────────────────
    ent_step4_heading: "Maelezo ya Biashara Yako",
    ent_step4_subtitle:
      "Taarifa hizi zinasaidia kurekebisha msaada na rasilimali kulingana na mahitaji yako maalum. Taarifa zote zinabaki siri.",
    ent_step4_employees_label: "Idadi ya wafanyakazi (ukijumuisha wewe mwenyewe)",
    ent_step4_employees_placeholder: "Mfano: 3",
    ent_step4_revenue_label: "Mapato ya wastani ya kila mwezi (kwa TZS)",
    ent_step4_challenges_label:
      "Changamoto kuu zinazokabili biashara yako sasa hivi (chagua zote zinazofaa)",
    ent_step4_support_received_label:
      "Je, umewahi kupata mafunzo au msaada wa biashara kabla?",
    ent_step4_support_org_label: "Kutoka shirika au mradi gani?",
    ent_step4_support_org_placeholder: "Mfano: TangaYetu, AGRA",
    ent_step4_support_needed_label:
      "Unatafuta aina gani ya msaada kutoka IMED Connect? (chagua zote zinazofaa)",
    ent_step4_tin_label: "TIN / Nambari ya Usajili wa Biashara (si lazima)",
    ent_step4_tin_placeholder: "Mfano: 123-456-789",
    ent_step4_disability_label: "Je, una aina yoyote ya ulemavu?",
    ent_step4_disability_desc_label: "Tafadhali eleza ulemavu wako",
    ent_step4_disability_desc_placeholder: "Eleza",
    ent_step4_error_employees: "Tafadhali weka idadi ya wafanyakazi.",
    ent_step4_error_challenges:
      "Tafadhali chagua angalau changamoto moja kuu.",
    ent_step4_error_support:
      "Tafadhali onyesha kama umewahi kupata msaada wa biashara kabla.",
    ent_step4_error_support_org:
      "Tafadhali taja shirika au mradi uliotoa msaada.",
    ent_step4_error_support_needed:
      "Tafadhali chagua angalau aina moja ya msaada unayotafuta.",
    ent_step4_error_disability:
      "Tafadhali onyesha kama una aina yoyote ya ulemavu.",
    ent_step4_error_disability_desc: "Tafadhali eleza ulemavu wako.",
    ent_step4_error_generic: "Kuna hitilafu. Tafadhali jaribu tena.",

    // ── Revenue ranges ───────────────────────────────────────────────────────
    revenue_below_500k: "Chini ya TZS 500,000",
    revenue_500k_2m: "TZS 500,001 – 2,000,000",
    revenue_2m_5m: "TZS 2,000,001 – 5,000,000",
    revenue_above_5m: "Zaidi ya TZS 5,000,000",

    // ── Business challenges ──────────────────────────────────────────────────
    challenge_finance: "Upatikanaji wa fedha",
    challenge_markets: "Masoko",
    challenge_skills: "Ujuzi",
    challenge_technology: "Teknolojia",
    challenge_regulations: "Kanuni",
    challenge_climate: "Mabadiliko ya tabianchi",
    challenge_other: "Nyingine",

    // ── Support types ────────────────────────────────────────────────────────
    support_training: "Mafunzo ya biashara",
    support_mentorship: "Ushauri na uelekezaji",
    support_market: "Viungo vya masoko",
    support_finance: "Upatikanaji wa fedha",
    support_networking: "Kuunda mtandao",
    support_other: "Nyingine",
  },
};

export default translations;
