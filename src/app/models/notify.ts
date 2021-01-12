export class Notify {
    constructor(
        public _id: string,
        public date: any,
        public userid: string,
        public username: string,
        public articletitle: string,
        public articleid: string,
        public message: string,
        public chapter: boolean,
        public alert: boolean
    ){}
}