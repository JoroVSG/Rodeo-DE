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

export interface AdsSession {
    'ads:session_id': string;
    'ads:name': string;
    'ads:startDate': Date;
    'ads:defaultTraits': AdsDefaultTraits;
    'ads:animals': string;
    'ads:defaultTreatments': AdsDefaultTreatments;
}

export interface AdsSessions {
    'ads:session': AdsSession[];
}

export interface AdsBody {
    'ads:header': AdsHeader;
    'ads:sessions': AdsSessions;
}

export interface SessionResponse {
    'ads:body': AdsBody;
}
