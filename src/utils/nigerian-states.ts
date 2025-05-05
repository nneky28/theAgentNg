// Define the structure for a Nigerian state with its cities
export interface NigerianState {
    name: string;
    cities: string[];
  }
  
  // Comprehensive list of Nigerian states and their major cities
  export const nigerianStates: NigerianState[] = [
    {
      name: 'Lagos',
      cities: [
        'Ikeja', 'Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Surulere', 'Yaba',
        'Gbagada', 'Apapa', 'Festac', 'Ikorodu', 'Epe', 'Badagry', 'Ojo', 'Alimosho',
        'Magodo', 'Ojodu', 'Maryland', 'Ogudu', 'Ilupeju', 'Mushin', 'Agege', 'Ikotun',
        'Isolo', 'Oshodi', 'Ajegunle', 'Ago', 'Okota', 'Ipaja', 'Egbeda'
      ]
    },
    {
      name: 'Abuja',
      cities: [
        'Central Area', 'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Utako', 'Jabi',
        'Gwarimpa', 'Kubwa', 'Karu', 'Nyanya', 'Jikwoyi', 'Lugbe', 'Gwagwalada',
        'Kuje', 'Bwari', 'Airport Road', 'Life Camp', 'Katampe', 'Dawaki'
      ]
    },
    {
      name: 'Rivers',
      cities: [
        'Port Harcourt', 'Obio-Akpor', 'Oyigbo', 'Eleme', 'Okrika', 'Bonny',
        'Etche', 'Tai', 'Gokana', 'Khana', 'Ahoada', 'Degema', 'Opobo', 'Andoni',
        'Omuma', 'Ikwerre', 'Ogu/Bolo', 'Emohua', 'Ogba/Egbema/Ndoni', 'Abua/Odual'
      ]
    },
    {
      name: 'Kano',
      cities: [
        'Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Tarauni', 'Nassarawa', 'Kumbotso',
        'Ungogo', 'Dawakin Tofa', 'Tofa', 'Rimin Gado', 'Bagwai', 'Gezawa', 'Gabasawa',
        'Minjibir', 'Dambatta', 'Makoda', 'Kunchi', 'Bichi', 'Shanono'
      ]
    },
    {
      name: 'Oyo',
      cities: [
        'Ibadan', 'Ogbomosho', 'Iseyin', 'Oyo', 'Saki', 'Eruwa', 'Igbo-Ora', 'Kishi',
        'Igboho', 'Lalupon', 'Ibarapa', 'Oke-Ogun', 'Moniya', 'Iwo Road', 'Ojoo',
        'Challenge', 'Ring Road', 'Mokola', 'Bodija', 'Dugbe'
      ]
    },
    {
      name: 'Kaduna',
      cities: [
        'Kaduna', 'Zaria', 'Kafanchan', 'Kagoro', 'Kachia', 'Zonkwa', 'Jema\'a', 'Kaura',
        'Birnin Gwari', 'Giwa', 'Ikara', 'Makarfi', 'Sabon Gari', 'Soba', 'Lere',
        'Kauru', 'Kubau', 'Igabi', 'Chikun', 'Kajuru'
      ]
    },
    {
      name: 'Anambra',
      cities: [
        'Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Aguata', 'Ihiala', 'Ogbaru', 'Abagana',
        'Umunya', 'Nkpor', 'Obosi', 'Ogidi', 'Ojoto', 'Oko', 'Orumba', 'Ozubulu',
        'Agulu', 'Adazi', 'Ukpo', 'Amawbia'
      ]
    },
    {
      name: 'Enugu',
      cities: [
        'Enugu', 'Nsukka', 'Oji River', 'Awgu', 'Udi', 'Agbani', 'Ugwuaji', 'Nkanu',
        'Iva Valley', 'Trans Ekulu', 'Independence Layout', 'New Haven', 'Uwani',
        'Abakpa Nike', 'Emene', 'GRA', 'Coal Camp', 'Ogui', 'Achara Layout', 'Maryland'
      ]
    },
    {
      name: 'Delta',
      cities: [
        'Asaba', 'Warri', 'Sapele', 'Ughelli', 'Agbor', 'Abraka', 'Ibusa', 'Ogwashi-Uku',
        'Ozoro', 'Oleh', 'Kwale', 'Patani', 'Burutu', 'Okpe', 'Oghara', 'Issele-Uku',
        'Kokori', 'Obiaruku', 'Obior', 'Umunede'
      ]
    },
    {
      name: 'Plateau',
      cities: [
        'Jos', 'Bukuru', 'Pankshin', 'Shendam', 'Langtang', 'Mangu', 'Bokkos', 'Barkin Ladi',
        'Wase', 'Kanke', 'Mikang', 'Qua\'an Pan', 'Riyom', 'Bassa', 'Jos North', 'Jos South',
        'Jos East', 'Kanam', 'Dengi', 'Vom'
      ]
    },
    {
      name: 'Abia',
      cities: [
        'Umuahia', 'Aba', 'Ohafia', 'Arochukwu', 'Bende', 'Isuikwuato', 'Umunneochi',
        'Ukwa East', 'Ukwa West', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Osisioma',
        'Ugwunagbo', 'Obingwa', 'Ikwuano', 'Umuahia North', 'Umuahia South', 'Umu Nneochi',
        'Isiukwuato', 'Ovia'
      ]
    },
    {
      name: 'Adamawa',
      cities: [
        'Yola', 'Mubi', 'Numan', 'Ganye', 'Mayo-Belwa', 'Jada', 'Fufore', 'Gombi',
        'Hong', 'Shelleng', 'Guyuk', 'Lamurde', 'Madagali', 'Maiha', 'Michika',
        'Song', 'Toungo', 'Demsa', 'Girei', 'Yola North'
      ]
    },
    {
      name: 'Akwa Ibom',
      cities: [
        'Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak', 'Etinan', 'Ikot Abasi', 'Itu',
        'Uruan', 'Mkpat Enin', 'Essien Udim', 'Ibiono-Ibom', 'Nsit Ubium', 'Nsit Ibom',
        'Nsit Atai', 'Oruk Anam', 'Ukanafun', 'Etim Ekpo', 'Ini', 'Ibeno'
      ]
    },
    {
      name: 'Bauchi',
      cities: [
        'Bauchi', 'Azare', 'Misau', 'Jama\'are', 'Katagum', 'Dass', 'Tafawa Balewa',
        'Alkaleri', 'Toro', 'Gamawa', 'Giade', 'Shira', 'Zaki', 'Ningi', 'Warji',
        'Darazo', 'Ganjuwa', 'Kirfi', 'Bogoro', 'Itas/Gadau'
      ]
    },
    {
      name: 'Bayelsa',
      cities: [
        'Yenagoa', 'Brass', 'Nembe', 'Ogbia', 'Southern Ijaw', 'Ekeremor', 'Kolokuma/Opokuma',
        'Sagbama', 'Oporoma', 'Kaiama', 'Amassoma', 'Twon-Brass', 'Oloibiri', 'Otuoke',
        'Okolobiri', 'Ogbolomabiri', 'Otuasega', 'Odi', 'Agudama-Epie', 'Akassa'
      ]
    },
    {
      name: 'Benue',
      cities: [
        'Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala', 'Vandeikya', 'Adikpo', 'Ukum',
        'Zaki Biam', 'Oju', 'Agatu', 'Buruku', 'Gwer', 'Konshisha', 'Kwande', 'Logo',
        'Ohimini', 'Obi', 'Ogbadibo', 'Tarka', 'Ushongo'
      ]
    },
    {
      name: 'Borno',
      cities: [
        'Maiduguri', 'Biu', 'Gwoza', 'Bama', 'Konduga', 'Damboa', 'Monguno', 'Dikwa',
        'Kukawa', 'Ngala', 'Gubio', 'Kaga', 'Marte', 'Magumeri', 'Mobbar', 'Guzamala',
        'Shani', 'Hawul', 'Askira/Uba', 'Chibok'
      ]
    },
    {
      name: 'Cross River',
      cities: [
        'Calabar', 'Ogoja', 'Obudu', 'Ikom', 'Ugep', 'Obubra', 'Akamkpa', 'Odukpani',
        'Biase', 'Akpabuyo', 'Bakassi', 'Etung', 'Boki', 'Yala', 'Obanliku', 'Yakurr',
        'Bekwarra', 'Abi', 'Calabar South', 'Calabar Municipal'
      ]
    },
    {
      name: 'Ebonyi',
      cities: [
        'Abakaliki', 'Afikpo', 'Onueke', 'Ishiagu', 'Uburu', 'Unwana', 'Onicha',
        'Ezzamgbo', 'Ohaukwu', 'Ivo', 'Ikwo', 'Izzi', 'Ezza North', 'Ezza South',
        'Ohaozara', 'Ishielu', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Onicha'
      ]
    },
    {
      name: 'Edo',
      cities: [
        'Benin City', 'Auchi', 'Ekpoma', 'Uromi', 'Irrua', 'Sabongida-Ora', 'Igarra',
        'Ewu', 'Agbor', 'Uzebba', 'Ubiaja', 'Igueben', 'Abudu', 'Fugar', 'Okpella',
        'Owan', 'Ovia', 'Egor', 'Oredo', 'Ikpoba-Okha'
      ]
    },
    {
      name: 'Ekiti',
      cities: [
        'Ado-Ekiti', 'Ikere', 'Ikole', 'Efon', 'Ijero', 'Ido', 'Oye', 'Omuo', 'Ilawe',
        'Aramoko', 'Igede', 'Emure', 'Ifaki', 'Ise', 'Otun', 'Ode', 'Iyin', 'Ilupeju',
        'Ijan', 'Ayede'
      ]
    },
    {
      name: 'Gombe',
      cities: [
        'Gombe', 'Billiri', 'Kaltungo', 'Bajoga', 'Kumo', 'Dukku', 'Nafada', 'Balanga',
        'Yamaltu/Deba', 'Shongom', 'Akko', 'Kwami', 'Funakaye', 'Balanga', 'Shongom',
        'Billiri', 'Kaltungo', 'Akko', 'Gombe LGA', 'Dukku'
      ]
    },
    {
      name: 'Imo',
      cities: [
        'Owerri', 'Orlu', 'Okigwe', 'Mbaise', 'Oguta', 'Mbano', 'Obowo', 'Nkwerre',
        'Orsu', 'Isu', 'Ngor Okpala', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte',
        'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Oru East'
      ]
    },
    {
      name: 'Jigawa',
      cities: [
        'Dutse', 'Hadejia', 'Birnin Kudu', 'Gumel', 'Kazaure', 'Ringim', 'Garki',
        'Jahun', 'Kafin Hausa', 'Kiyawa', 'Auyo', 'Babura', 'Birniwa', 'Buji',
        'Guri', 'Gwaram', 'Gwiwa', 'Maigatari', 'Malam Madori', 'Sule Tankarkar'
      ]
    },
    {
      name: 'Kebbi',
      cities: [
        'Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru', 'Jega', 'Koko', 'Dandi', 'Bunza',
        'Augie', 'Aleiro', 'Arewa', 'Bagudo', 'Fakai', 'Gwandu', 'Kalgo', 'Maiyama',
        'Ngaski', 'Sakaba', 'Shanga', 'Suru'
      ]
    },
    {
      name: 'Kogi',
      cities: [
        'Lokoja', 'Okene', 'Kabba', 'Ankpa', 'Idah', 'Ajaokuta', 'Dekina', 'Koton Karfe',
        'Adavi', 'Ijumu', 'Ofu', 'Yagba East', 'Yagba West', 'Bassa', 'Ibaji', 'Igalamela-Odolu',
        'Mopa-Muro', 'Okehi', 'Ogori/Magongo', 'Olamaboro'
      ]
    },
    {
      name: 'Kwara',
      cities: [
        'Ilorin', 'Offa', 'Patigi', 'Omu-Aran', 'Jebba', 'Lafiagi', 'Kaiama', 'Erin-Ile',
        'Share', 'Ilesha Baruba', 'Kaiama', 'Shao', 'Bode Saadu', 'Okeya', 'Idofian',
        'Oke Onigbin', 'Ajasse Ipo', 'Oro', 'Igbaja', 'Esie'
      ]
    },
    {
      name: 'Nasarawa',
      cities: [
        'Lafia', 'Keffi', 'Nasarawa', 'Akwanga', 'Wamba', 'Karu', 'Keana', 'Obi',
        'Awe', 'Doma', 'Toto', 'Kokona', 'Nasarawa Eggon', 'Kadarko', 'Mararaba',
        'New Karu', 'Masaka', 'Garaku', 'Uke', 'Gadabuke'
      ]
    },
    {
      name: 'Niger',
      cities: [
        'Minna', 'Bida', 'Kontagora', 'Suleja', 'Agaie', 'Lapai', 'Mokwa', 'New Bussa',
        'Kagara', 'Rijau', 'Agwara', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako',
        'Gurara', 'Katcha', 'Lavun', 'Magama'
      ]
    },
    {
      name: 'Ondo',
      cities: [
        'Akure', 'Ondo', 'Owo', 'Ikare', 'Okitipupa', 'Idanre', 'Ile-Oluji', 'Ifon',
        'Oka-Akoko', 'Igbokoda', 'Odigbo', 'Irele', 'Isua', 'Akoko', 'Ilaje', 'Ose',
        'Akoko North-East', 'Akoko North-West', 'Akoko South-East', 'Akoko South-West'
      ]
    },
    {
      name: 'Osun',
      cities: [
        'Osogbo', 'Ile-Ife', 'Ilesa', 'Ede', 'Iwo', 'Ikirun', 'Ejigbo', 'Ikire',
        'Ila Orangun', 'Ijebu-Jesa', 'Inisa', 'Okuku', 'Iragbiji', 'Ipetu-Ijesa',
        'Ilobu', 'Gbongan', 'Ode Omu', 'Ifetedo', 'Ibokun', 'Ife North'
      ]
    },
    {
      name: 'Sokoto',
      cities: [
        'Sokoto', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni',
        'Shagari', 'Silame', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo',
        'Binji', 'Bodinga', 'Dange-Shuni', 'Goronyo'
      ]
    },
    {
      name: 'Taraba',
      cities: [
        'Jalingo', 'Wukari', 'Bali', 'Gembu', 'Takum', 'Ibi', 'Zing', 'Lau', 'Karim Lamido',
        'Gassol', 'Sardauna', 'Ardo Kola', 'Gashaka', 'Kurmi', 'Ussa', 'Yorro', 'Donga',
        'Gassol', 'Takum', 'Ussa'
      ]
    },
    {
      name: 'Yobe',
      cities: [
        'Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Geidam', 'Buni Yadi', 'Nangere', 'Yusufari',
        'Machina', 'Karasuwa', 'Jakusko', 'Bade', 'Fika', 'Fune', 'Gujba', 'Gulani',
        'Tarmuwa', 'Yunusari', 'Bursari', 'Damaturu'
      ]
    },
    {
      name: 'Zamfara',
      cities: [
        'Gusau', 'Kaura Namoda', 'Anka', 'Talata Mafara', 'Bukkuyum', 'Bungudu', 'Gummi',
        'Maradun', 'Shinkafi', 'Tsafe', 'Zurmi', 'Birnin Magaji', 'Bakura', 'Maru',
        'Chafe', 'Bakura', 'Maradun', 'Shinkafi', 'Talata Mafara', 'Zurmi'
      ]
    }
  ];
  
  /**
   * Get cities for a specific state
   * @param stateName The name of the Nigerian state
   * @returns Array of cities in that state
   */
  export const getCities = (stateName: string): string[] => {
    const state = nigerianStates.find(s => s.name === stateName);
    return state ? state.cities : [];
  };
  
  /**
   * Get list of all state names
   * @returns Array of state names
   */
  export const getStateNames = (): string[] => {
    return nigerianStates.map(state => state.name);
  };