export enum ContextType {
    BIBLE = "bible",
    CONFESSION = "confession",
    CATECHISM = "catechism",
    MORAL = "moral",
    CALENDAR = "calendar",
    PRAYERS = "prayers"
}

export type CreateUserDto = {
    name: string;
    email: string;
    password: string;
}