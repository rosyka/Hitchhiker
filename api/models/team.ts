import { OneToOne, JoinColumn, OneToMany, Entity, PrimaryColumn, Column, ManyToMany, CreateDateColumn, JoinTable } from 'typeorm';
import { Collection } from './collection';
import { User } from './user';
import { Environment } from "./environment";

@Entity()
export class Team {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @JoinTable()
    @ManyToMany(type => User, user => user.teams, {
        cascadeInsert: true
    })
    members: User[] = [];

    @OneToMany(type => Collection, collection => collection.team)
    collections: Collection[] = [];

    @OneToMany(type => Environment, environment => environment.team)
    environments: Environment[] = [];

    @Column({ nullable: true })
    note: string;

    @JoinColumn()
    @OneToOne(type => User)
    owner: User;

    @CreateDateColumn()
    createDate: Date;
}