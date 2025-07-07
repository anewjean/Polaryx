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

    let roles: string[] = [];
    if (typeof row.role === "string") {
      roles = row.role.split(",").map((r: string) => r.trim());
      // 허용된 role만 있는지 검사
      const allValid = roles.every((role) => allowedRoles.includes(role));
      if (!allValid) continue;
    }
    users.push(row);
  }
  return {
    users,
    errors,
  };
}
