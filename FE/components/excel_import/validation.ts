export function filterUsers(data: any[]): { users: any[]; errors: string[]; total: number } {
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

    if (row.github) {
      const githubPattern = /^https:\/\/github\.com\/[A-Za-z0-9_-]+$/;
      if (!githubPattern.test(row.github)) {
        continue;
      }
    }

    let roles: string[] = [];
    if (typeof row.role === "string") {
      roles = row.role.split(",").map((r: string) => r.trim());
      // 허용된 role만 있는지 검사
      const allValid = roles.every((role) => allowedRoles.includes(role));
      if (!allValid) continue;
    }
    users.push(row);
    console.log("users", users);
  }
  return {
    users,
    errors,
    total: data.length - users.length,
  };
}
