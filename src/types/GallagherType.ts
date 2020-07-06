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
    'ads:eid': string;
}

export interface AdsAnimal {
    'ads:animalId': AdsAnimalId;
    'ads:weight': number;
    'ads:datetime': Date;
}

export interface AdsAnimals {
    'ads:animal': AdsAnimal[];
}

export interface AdsSession {
    'ads:session_id': string;
    'ads:name': string;
    'ads:startDate': Date;
    'ads:defaultTraits': AdsDefaultTraits;
    'ads:animals': AdsAnimals;
    'ads:defaultTreatments': AdsDefaultTreatments;
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
