import { Metadata } from "next";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
export const metadata: Metadata = {
  title: "Dashboard - Highway Delite",
};
