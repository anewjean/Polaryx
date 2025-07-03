from uuid import UUID

from BE.app.domain.workspace_member import WorkspaceMember
from BE.app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from BE.app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from BE.app.schema.workspace_members.response import WorkspaceMemberResponse

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()

    def get_profile(self, id: UUID) -> WorkspaceMemberResponse:
        """Return profile information for the given member.

        This currently returns a dummy response because the database layer
        is not fully implemented.
        """
        try:
            member = self.workspace_member_repo.find_by_id(id)
        except Exception:
            member = None

        if member:
            return WorkspaceMemberResponse(
                id=member.id.hex,
                user_id=member.user_id.hex,
                nickname=member.nickname,
                email=member.email,
                github=getattr(member, "github", None),
                blog=getattr(member, "blog", None),
                image=getattr(member, "image", None),
                phone=getattr(member, "phone", None),
            )

        # fallback stub data
        return WorkspaceMemberResponse(
            id=id.hex,
            user_id=id.hex,
            nickname="Sample User",
            email="user@example.com",
            github=None,
            blog=None,
            image=None,
            phone=None,
        )
    
    def get_member_by_id(self, id: UUID) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_id(id)
        return workspace_member
    
    def get_member_by_email(self, email: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_email(email)
        return workspace_member
    
    def get_all_members(self, workspace_id: int) -> list[WorkspaceMember]:
        all_workspace_members = self.workspace_member_repo.find_all(workspace_id)
        return all_workspace_members
        
    def update_profile(self, id: UUID, update_data: UpdateWorkspaceMemberRequest) -> WorkspaceMemberResponse:
        try:
            self.workspace_member_repo.update(id, update_data)
            updated = self.workspace_member_repo.find_by_id(id)
        except Exception:
            updated = None

        if updated:
            return WorkspaceMemberResponse(
                id=updated.id.hex,
                user_id=updated.user_id.hex,
                nickname=update_data.nickname or updated.nickname,
                email=updated.email,
                github=update_data.github or getattr(updated, "github", None),
                blog=update_data.blog or getattr(updated, "blog", None),
                image=update_data.image or getattr(updated, "image", None),
                phone=update_data.phone or getattr(updated, "phone", None),
            )

        # fallback to dummy data merged with update
        base = self.get_profile(id).dict()
        base.update(update_data.model_dump(exclude_unset=True))
        return WorkspaceMemberResponse(**base)
    
    def _to_response(self, member: WorkspaceMember) -> WorkspaceMemberResponse:
        from dataclasses import asdict

        data = asdict(member)
        data["id"] = member.id.hex
        data["user_id"] = member.user_id.hex
        return WorkspaceMemberResponse(**data)