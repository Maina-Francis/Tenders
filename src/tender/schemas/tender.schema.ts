import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Tender {
  @Prop()
  id_tenderdetails: number;

  @Prop()
  ocid: string;

  @Prop()
  peid: number;

  @Prop()
  pename: string;

  @Prop()
  title: string;

  @Prop()
  procurementmethod: string;

  @Prop()
  procurementmethodcode: string;

  @Prop()
  submissionmethod: string;

  @Prop()
  procurementcategory: string;

  @Prop()
  procurementcategorycode: string;

  @Prop()
  publisheddate: string;

  @Prop()
  closedate: string;

  @Prop()
  financialyr: string;

  @Prop()
  addendumadded: string;
}

export const TenderSchema = SchemaFactory.createForClass(Tender);
