export class Article{

    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public type: string,
        public date: any,
        public image: string,
        public genders: [],
        public progress: string,
        public state: boolean,
        public user: string

    ){}
}