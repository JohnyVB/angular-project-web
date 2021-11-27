export class User {

    constructor(

        public _id: any,
        public name: string,
        public lastname: string,
        public biography: string,
        public email: string,
        public password: string,
        public image: string,
        public state: boolean,
        public role: string,
        public reader: boolean,
        public date: any,
        public validatorNumber: any

    ) { }
}