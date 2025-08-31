import mongoose, { Schema, Document, Model } from "mongoose";
import { INote } from "@/types/types";
const NoteSchema = new Schema<INote>(
  {
    note: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
export default Note;
