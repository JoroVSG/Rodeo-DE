export interface AdsHeader {
    'ads:version': number;
    'ads:createdBy': string;
    'ads:dateTimeCreated': Date;
}

export interface AdsDefaultTraits {
    'ads:defaultTrait': any;
}

export interface AdsDefaultTreatment {
    'ads:type': string;
    'ads:defaultAmount': number;
}

export interface AdsDefaultTreatments {
    'ads:defaultTreatment': AdsDefaultTreatment;
}

export interface AdsAnimalId {
    'ads:tag': string;
    'ads:eid': string;
}

export interface AdsAnimalWeightAttributes {
    'ads:recorded': Date
}

export interface AdsAnimalWeight {
    'ads:value': number,
    'ads:attributes': AdsAnimalWeightAttributes
}

export type AdsNote = AdsAnimalWeight[] | AdsAnimalWeight

export interface AdsNotes {
    'ads:note': AdsNote
}

export interface AdsAnimal {
    'ads:animalId': AdsAnimalId;
    'ads:weight': AdsAnimalWeight;
    'ads:datetime': Date;
    'ads:notes': AdsNotes;
    'ads:treatments': AdsTreatments;
    rodeoAnimalId: number | undefined
}

export interface AdsAttributes {
    'ads:count': number
}

export interface AdsAnimals {
    'ads:animal': AdsAnimal[];
    'ads:attributes': AdsAttributes
}

export interface AdsSession {
    'ads:session_id': string;
    'ads:name': string;
    'ads:startDate': Date;
    'ads:defaultTraits': AdsDefaultTraits;
    'ads:animals': AdsAnimals;
    'ads:defaultTreatments': AdsDefaultTreatments;
    'ads:sync': boolean
}

export interface AdsSessions {
    'ads:session': AdsSession[] | AdsSession;
}

export interface AdsBody {
    'ads:header': AdsHeader;
    'ads:sessions': AdsSessions;
}

export interface SessionResponse {
    'ads:body': AdsBody;
}

export interface AdsTreatments {
    'ads:treatment': AdsDefaultTreatment
}
