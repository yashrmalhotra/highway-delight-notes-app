import Note from "@/models/Notes";
import { connectToDataBase } from "./connectDB";

export const getNotes = async (email: string): Promise<Record<string, any>[]> => {
  await connectToDataBase();
  try {
    const notes = await Note.find({ createdBy: email }).select("note");
    return notes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const createNote = async (data: { email: string; note: string }): Promise<void> => {
  const { email, note } = data;
  await connectToDataBase();
  try {
    await Note.create({ note, createdBy: email });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export const deleteNote = async (data: { id: string }): Promise<void> => {
  const { id } = data;
  await connectToDataBase();
  try {
    await Note.findByIdAndDelete(id);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
