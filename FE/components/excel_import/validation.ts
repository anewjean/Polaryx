export function filterUsers(data: any[]): { users: any[]; errors: string[] } {
  const errors: string[] = [];
  const users: any[] = [];
  const allowedRoles = ["staff", "coach junior", "admin", "student", "alamni", "coach senior"];

  for (const row of data) {
    if (!row.name || !row.email) {
      continue;
    }

    if (!row.email.includes("@") || !row.email.endsWith("@gmail.com")) {
      continue;
    }

    users.push(row);
  }
  return {
    users,
    errors,
  };
}
