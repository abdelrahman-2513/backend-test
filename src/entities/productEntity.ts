import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from "typeorm";


@Entity()
@Index(["name"])
@Index(["category"])
@Index(["price"])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;



    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "varchar", nullable: false })
    category?: string;

    @Column({ type: "float", nullable: false })
    price: number;

    @Column({ type: "int", default: 0 })
    quantity: number;

   

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date; 

    
}
