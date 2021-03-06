import bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    OneToMany
} from "typeorm";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ "type": "text" })
    @IsEmail()
    email: string | null;

    @Column({ "type": "boolean", "default": false })
    verifiedEmail: boolean;

    @Column({ "type": "text" })
    firstName: string;

    @Column({ "type": "text" })
    lastName: string;

    @Column({ "type": "int", "nullable": true })
    age: number;

    @Column({ "type": "text", "nullable": true })
    password: string;

    @Column({ "type": "text", "nullable": true })
    phoneNumber: string;

    @Column({ "type": "boolean", "default": false })
    verifiedPhoneNumber: boolean;

    @Column({ "type": "text" })
    profilePhoto: string;

    @Column({ "type": "boolean", "default": false })
    isDriving: boolean;

    @Column({ "type": "boolean", "default": false })
    isRiding: boolean;

    @Column({ "type": "boolean", "default": false })
    isTaken: boolean;

    @Column({ "type": "double precision", "default": 0 })
    lastLng: number;

    @Column({ "type": "double precision", "default": 0 })
    lastLat: number;

    @Column({ "type": "double precision", "default": 0 })
    lastOrientation: number;

    @Column({ "type": "text" })
    fbId: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @ManyToOne(() => Chat, chat => chat.participants)
    chat: Chat;

    @OneToMany(() => Message, message => message.user)
    messages: Message[];

    @OneToMany(() => Ride, ride => ride.passenger)
    ridesAsPassenger: Ride[];

    @OneToMany(() => Ride, ride => ride.driver)
    ridesAsDriver: Ride[];

    @BeforeInsert()
    @BeforeUpdate()
    async savePassword(): Promise<void> {
        if (this.password) {
            const hashedPassword = await this.hashPassword(this.password);
            this.password = hashedPassword;
        }
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, BCRYPT_ROUNDS);
    }
}

export default User;
