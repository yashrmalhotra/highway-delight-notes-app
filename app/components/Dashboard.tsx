"use client";
import React, { useEffect, useState } from "react";
import "../style.css";
import { Box, Button, IconButton, Dialog, TextareaAutosize, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { Note } from "@/types/types";
import { useAuthContext } from "../context/AuthContextProvider";
import { signOut } from "next-auth/react";
const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogOutLoading, setIsLogOutLoading] = useState<boolean>(false);

  const [isNotesLoading, setIsNotesLoading] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const { email, name } = useAuthContext()!;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNote(e.target.value);
  };
  useEffect(() => {
    (async () => {
      try {
        setIsNotesLoading(true);
        const { data } = await axios.get(`/api/note/${email}`);

        setNotes(data.notes);
      } catch (error) {
        console.log(error);
      } finally {
        setIsNotesLoading(false);
      }
    })();
  }, []);
  console.log("notes", notes);
  const saveNote = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.post("/api/note", { email, note });
      window.location.reload();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const deleteNote = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.delete("/api/note", { data: { id } });
      window.location.reload();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogOut = async () => {
    try {
      setIsLogOutLoading(true);

      await signOut();
      window.location.reload();
    } finally {
      setIsLogOutLoading(false);
    }
  };
  // if(isNotesLoading){

  // }
  return (
    <div>
      <nav className="p-3 flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <img src="/hd.svg" alt="hd img" width={20} />
          <button className="text-[20px] ml-5 ">Dashboard</button>
        </div>
        {isLogOutLoading ? (
          <CircularProgress size="30px" />
        ) : (
          <button onClick={handleLogOut} className="text-[#367AFF] underline">
            Sign out
          </button>
        )}
      </nav>

      <section>
        <div className="flex flex-col items-center container mx-auto  mt-3 ">
          <div className="shadow-all-sides w-[80%] rounded-2xl p-2">
            <h1 className="text-2xl md:text-5xl font-semibold">Welcome, {name}</h1>
            <p className="mt-5 mb-3">Email: {email}</p>
          </div>
          <div className="my-5 w-[80%]">
            <Button
              onClick={() => setOpen(true)}
              sx={{
                width: "100%",
                backgroundColor: "#367AFF",
                color: "white",
                fontWeight: "semibold",
                borderRadius: "10px",
              }}
            >
              Create Note
            </Button>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col items-center container mx-auto">
          <div className="w-[80%]">
            <h3 className="font-semibold text-[18px] mb-5">Notes</h3>
            <ul className="flex flex-col gap-y-3">
              {notes.length === 0 && !isNotesLoading ? (
                <div className=" shadow-all-sides bg-gray-100 p-2">No Notes found, Create One</div>
              ) : isNotesLoading ? (
                <CircularProgress />
              ) : (
                notes.map((item) => (
                  <li key={item._id} className="rounded-[10px] shadow-all-sides flex justify-between items-center p-2 ">
                    <p>{item.note}</p>
                    <IconButton onClick={() => deleteNote(item._id)}>{isLoading ? <CircularProgress size="10px" sx={{ color: "white" }} /> : <RiDeleteBin6Line />}</IconButton>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create a note</DialogTitle>

          <DialogContent>
            <TextareaAutosize onChange={handleChange} className="border p-2 rounded" minRows={3} placeholder="Enter text here" />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={note.length === 0}
              onClick={saveNote}
              sx={{
                background: "#367AFF",
                color: "white",
                ":disabled": {
                  backgroundColor: "#b3d1ff",
                  cursor: "not-allowed",
                  pointerEvents: "auto",
                  color: "white",
                },
              }}
            >
              {isLoading ? <CircularProgress size="16px" sx={{ color: "white" }} /> : <p>Save</p>}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                background: "red",
                color: "white",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </section>
    </div>
  );
};

export default Dashboard;
