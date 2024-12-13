import Login from "./login/page";

export const metadata = {
  title: "Furniro",
  description: "Browse the products",
};
export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}
