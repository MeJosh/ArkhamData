import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryColumn({ type: 'varchar' })
  code!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ name: 'real_name', type: 'varchar', nullable: true })
  realName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  subname!: string | null;

  @Column({ name: 'type_code', type: 'varchar', nullable: true })
  typeCode!: string | null;

  @Column({ name: 'type_name', type: 'varchar', nullable: true })
  typeName!: string | null;

  @Column({ name: 'faction_code', type: 'varchar', nullable: true })
  factionCode!: string | null;

  @Column({ name: 'faction_name', type: 'varchar', nullable: true })
  factionName!: string | null;

  @Column({ name: 'pack_code', type: 'varchar', nullable: true })
  packCode!: string | null;

  @Column({ name: 'pack_name', type: 'varchar', nullable: true })
  packName!: string | null;

  @Column({ type: 'int', nullable: true })
  position!: number | null;

  @Column({ type: 'boolean', nullable: true })
  exceptional!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  myriad!: boolean | null;

  @Column({ type: 'int', nullable: true })
  cost!: number | null;

  @Column({ type: 'int', nullable: true })
  xp!: number | null;

  @Column({ type: 'text', nullable: true })
  text!: string | null;

  @Column({ name: 'real_text', type: 'text', nullable: true })
  realText!: string | null;

  @Column({ type: 'int', nullable: true })
  quantity!: number | null;

  @Column({ name: 'skill_willpower', type: 'int', nullable: true })
  skillWillpower!: number | null;

  @Column({ name: 'skill_intellect', type: 'int', nullable: true })
  skillIntellect!: number | null;

  @Column({ name: 'skill_combat', type: 'int', nullable: true })
  skillCombat!: number | null;

  @Column({ name: 'skill_agility', type: 'int', nullable: true })
  skillAgility!: number | null;

  @Column({ name: 'skill_wild', type: 'int', nullable: true })
  skillWild!: number | null;

  @Column({ type: 'int', nullable: true })
  health!: number | null;

  @Column({ name: 'health_per_investigator', type: 'boolean', nullable: true })
  healthPerInvestigator!: boolean | null;

  @Column({ type: 'int', nullable: true })
  sanity!: number | null;

  @Column({ name: 'sanity_per_investigator', type: 'boolean', nullable: true })
  sanityPerInvestigator!: boolean | null;

  @Column({ type: 'varchar', nullable: true })
  slot!: string | null;

  @Column({ name: 'real_slot', type: 'varchar', nullable: true })
  realSlot!: string | null;

  @Column({ type: 'varchar', nullable: true })
  traits!: string | null;

  @Column({ name: 'real_traits', type: 'varchar', nullable: true })
  realTraits!: string | null;

  @Column({ name: 'deck_limit', type: 'int', nullable: true })
  deckLimit!: number | null;

  @Column({ name: 'deck_requirements', type: 'jsonb', nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deckRequirements!: any;

  @Column({ name: 'deck_options', type: 'jsonb', nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deckOptions!: any;

  @Column({ type: 'text', nullable: true })
  flavor!: string | null;

  @Column({ type: 'varchar', nullable: true })
  illustrator!: string | null;

  @Column({ name: 'is_unique', type: 'boolean', nullable: true })
  isUnique!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  permanent!: boolean | null;

  @Column({ name: 'double_sided', type: 'boolean', nullable: true })
  doubleSided!: boolean | null;

  @Column({ name: 'back_text', type: 'text', nullable: true })
  backText!: string | null;

  @Column({ name: 'back_flavor', type: 'text', nullable: true })
  backFlavor!: string | null;

  @Column({ name: 'octgn_id', type: 'varchar', nullable: true })
  octgnId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  url!: string | null;

  @Column({ type: 'varchar', nullable: true })
  imagesrc!: string | null;

  @Column({ type: 'varchar', nullable: true })
  backimagesrc!: string | null;

  @Column({ name: 'duplicated_by', type: 'jsonb', nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  duplicatedBy!: any;

  @Column({ name: 'alternated_by', type: 'jsonb', nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alternatedBy!: any;

  @Column({ name: 'subtype_code', type: 'varchar', nullable: true })
  subtypeCode!: string | null;

  @Column({ name: 'subtype_name', type: 'varchar', nullable: true })
  subtypeName!: string | null;

  @Column({ name: 'enemy_damage', type: 'int', nullable: true })
  enemyDamage!: number | null;

  @Column({ name: 'enemy_horror', type: 'int', nullable: true })
  enemyHorror!: number | null;

  @Column({ name: 'enemy_fight', type: 'int', nullable: true })
  enemyFight!: number | null;

  @Column({ name: 'enemy_evade', type: 'int', nullable: true })
  enemyEvade!: number | null;

  @Column({ type: 'int', nullable: true })
  victory!: number | null;

  @Column({ type: 'jsonb', nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restrictions!: any;

  @Column({ name: 'errata_date', type: 'varchar', nullable: true })
  errataDate!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
