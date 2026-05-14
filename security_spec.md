# Security Specification: Nasir Hussain Portfolio

## Data Invariants
1. Projects, Certifications, Blogs, and Services can only be created/updated/deleted by an Admin.
2. Admins are users whose UIDs exist in the `/admins/` collection.
3. Every write operation must validate the data structure to prevent shadow fields or poisoning.
4. Timestamps (`createdAt`, `updatedAt`, `publishedAt`) must be server-generated.
5. Slugs for blogs must be unique (enforced via application logic and read-only constraints for users).
6. Public users can only READ published blogs and all projects/certifications/services.

## The Dirty Dozen Payloads (Target: DENIED)
1. **Unauthenticated Write:** Attempt to create a project without being logged in.
2. **Identity Spoofing:** A logged-in non-admin user attempts to add themselves to the `admins` collection.
3. **Shadow Update:** Attempt to add an `isVerified` field to a project document that isn't in the schema.
4. **ID Poisoning:** Attempt to create a project with a 2KB junk string as the document ID.
5. **Resource Exhaustion:** Attempt to update a blog with a 2MB content string (rules should cap size if possible, though Firestore has a 1MB limit).
6. **State Shortcut:** Attempt to set a project `order` to -1 or a non-numeric value.
7. **Orphaned Record:** Creating a project with a category ID that doesn't exist (relational sync).
8. **PII Leak:** Attempting to query the `admins` collection as a non-admin.
9. **Terminal State Break:** Attempting to edit a blog that is marked as "final" (if implemented).
10. **Timestamp Spoofing:** Setting `createdAt` to a future date instead of `request.time`.
11. **Type Poisoning:** Setting `technologies` to a string instead of an array.
12. **Key Injection:** Adding a `hiddenField` to a Category.

## Test Cases
- [ ] `create /projects/` -> DENY if !isAdmin
- [ ] `update /blogs/slug` -> DENY if !isAdmin
- [ ] `create /admins/myUid` -> DENY (even if authenticated)
- [ ] `list /admins` -> DENY if !isAdmin
