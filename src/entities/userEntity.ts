import {
    Entity,
    PrimaryGeneratedColumn,
    ObjectIdColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { EUserRole } from "../enums/user-role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; 


    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ unique: true, type: "varchar", nullable: false })
    email: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @Column({ default: "user", type: "enum", enum: EUserRole })
    role: EUserRole;



    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
}
