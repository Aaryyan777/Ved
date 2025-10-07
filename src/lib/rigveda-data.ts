// Sample Rigveda data for demonstration
// In production, this would come from a comprehensive database

export interface RigvedaVerse {
  mandala: number
  hymn: number
  verse: number
  sanskrit: string
  transliteration: string
  translations: {
    english: string
    hindi?: string
    author?: string
  }
  deity?: string
  meter?: string
}

// Sample verses from Rigveda
export const rigvedaData: RigvedaVerse[] = [
  {
    mandala: 1,
    hymn: 1,
    verse: 1,
    sanskrit: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥",
    transliteration: "agnim īḷe purohitaṃ yajñasya devam ṛtvijam | hotāraṃ ratnadhātamam ||",
    translations: {
      english: "I praise Agni, the chosen Priest, God, minister of sacrifice, The hotar, lavishest of wealth.",
      hindi: "मैं अग्नि की स्तुति करता हूँ, जो पुरोहित, यज्ञ के देवता, ऋत्विज, होता और सर्वाधिक धन देने वाले हैं।",
      author: "Ralph T.H. Griffith"
    },
    deity: "Agni",
    meter: "Gayatri"
  },
  {
    mandala: 1,
    hymn: 1,
    verse: 2,
    sanskrit: "अग्निः पूर्वेभिरृषिभिरीड्यो नूतनैरुत । स देवाँ एह वक्षति ॥",
    transliteration: "agniḥ pūrvebhir ṛṣibhir īḍyo nūtanair uta | sa devām̐ eha vakṣati ||",
    translations: {
      english: "Worthy is Agni to be praised by living as by ancient seers. He shall bring hitherward the Gods.",
      hindi: "अग्नि प्राचीन ऋषियों द्वारा और वर्तमान ऋषियों द्वारा स्तुति के योग्य हैं। वह देवताओं को यहाँ लाएंगे।",
      author: "Ralph T.H. Griffith"
    },
    deity: "Agni",
    meter: "Gayatri"
  },
  {
    mandala: 1,
    hymn: 1,
    verse: 3,
    sanskrit: "अग्निना रयिमश्नवत्पोषमेव दिवेदिवे । यशसं वीरवत्तमम् ॥",
    transliteration: "agninā rayim aśnavat poṣam eva dive-dive | yaśasaṃ vīravattamam ||",
    translations: {
      english: "Through Agni man obtaineth wealth, yea, plenty waxing day by day, Most rich in heroes, glorious.",
      hindi: "अग्नि के द्वारा मनुष्य धन प्राप्त करता है, प्रतिदिन बढ़ने वाली समृद्धि, वीरों से परिपूर्ण और यशस्वी।",
      author: "Ralph T.H. Griffith"
    },
    deity: "Agni",
    meter: "Gayatri"
  },
  {
    mandala: 10,
    hymn: 129,
    verse: 1,
    sanskrit: "नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् । किमावरीवः कुह कस्य शर्मन्नम्भः किमासीद्गहनं गभीरम् ॥",
    transliteration: "nāsad āsīn no sad āsīt tadānīṃ nāsīd rajo no vyomā paro yat | kim āvarīvaḥ kuha kasya śarman ambhaḥ kim āsīd gahanaṃ gabhīram ||",
    translations: {
      english: "Then was not non-existent nor existent: there was no realm of air, no sky beyond it. What covered in, and where? and what gave shelter? Was water there, unfathomed depth of water?",
      hindi: "तब न अस्तित्व था और न अनस्तित्व, न वायु था और न आकाश। क्या आवृत था? कहाँ? किसकी शरण में? जल था क्या, गहन और अथाह?",
      author: "Ralph T.H. Griffith"
    },
    deity: "Creation",
    meter: "Trishtubh"
  },
  {
    mandala: 10,
    hymn: 129,
    verse: 2,
    sanskrit: "न मृत्युरासीदमृतं न तर्हि न रात्र्या अह्न आसीत्प्रकेतः । आनीदवातं स्वधया तदेकं तस्माद्धान्यन्न परः किञ्चनास ॥",
    transliteration: "na mṛtyur āsīd amṛtaṃ na tarhi na rātryā ahna āsīt praketaḥ | ānīd avātaṃ svadhayā tad ekaṃ tasmād dhānya na paraḥ kiñcanāsa ||",
    translations: {
      english: "Death was not then, nor was there aught immortal: no sign was there, the day's and night's divider. That One Thing, breathless, breathed by its own nature: apart from it was nothing whatsoever.",
      hindi: "तब न मृत्यु थी और न अमरता, न दिन और रात का चिह्न। वह एक वस्तु, निःश्वास होते हुए भी अपनी शक्ति से श्वास ले रही थी। उसके अतिरिक्त कुछ भी नहीं था।",
      author: "Ralph T.H. Griffith"
    },
    deity: "Creation",
    meter: "Trishtubh"
  }
]

export const getRigvedaVerse = (
  mandala: number,
  hymn: number,
  verse: number
): RigvedaVerse | null => {
  return rigvedaData.find(
    (v) => v.mandala === mandala && v.hymn === hymn && v.verse === verse
  ) || null
}