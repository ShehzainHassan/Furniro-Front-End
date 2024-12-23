import UsersList from "../users/page";

export default function DeleteUser() {
  return (
    <div>
      <UsersList isDeleting={true} />
    </div>
  );
}
