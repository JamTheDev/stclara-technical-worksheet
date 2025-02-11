create type "public"."FriendRequestStatus" as enum ('PENDING', 'ACCEPTED', 'DECLINED');

create table "public"."Attachment" (
    "id" text not null,
    "url" text not null,
    "createdAt" timestamp(3) without time zone not null,
    "createdById" uuid not null,
    "name" text not null
);


create table "public"."Food" (
    "id" text not null,
    "attachment" text not null,
    "name" text not null default 'Untitled'::text,
    "uploadDate" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


create table "public"."FriendRequest" (
    "id" text not null,
    "senderId" text not null,
    "receiverId" text not null,
    "status" "FriendRequestStatus" not null default 'PENDING'::"FriendRequestStatus",
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


create table "public"."Note" (
    "id" text not null,
    "name" text not null,
    "attachment" text not null,
    "createdAt" timestamp(3) without time zone not null
);


create table "public"."Photo" (
    "id" text not null,
    "name" text not null,
    "attachment" text not null
);


create table "public"."Pokemon" (
    "id" text not null,
    "name" text not null,
    "attachment" text not null
);


create table "public"."Profile" (
    "id" text not null,
    "fullname" text not null,
    "userId" text not null
);


create table "public"."Review" (
    "id" text not null,
    "content" text not null,
    "createdAt" timestamp(3) without time zone not null,
    "createdById" uuid not null,
    "foodId" text,
    "pokemonId" text
);


create table "public"."Secret" (
    "id" text not null,
    "userId" uuid not null,
    "message" text not null,
    "created_at" timestamp(3) without time zone not null,
    "updated_at" timestamp(3) without time zone not null
);


create table "public"."Todo" (
    "id" text not null,
    "title" text not null,
    "description" text,
    "completed" boolean not null,
    "createdAt" timestamp(3) without time zone not null,
    "dueDate" timestamp(3) without time zone,
    "userId" uuid not null
);


create table "public"."_Friendship" (
    "A" text not null,
    "B" text not null
);


create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


CREATE UNIQUE INDEX "Attachment_pkey" ON public."Attachment" USING btree (id);

CREATE UNIQUE INDEX "Food_pkey" ON public."Food" USING btree (id);

CREATE UNIQUE INDEX "FriendRequest_pkey" ON public."FriendRequest" USING btree (id);

CREATE UNIQUE INDEX "Note_pkey" ON public."Note" USING btree (id);

CREATE UNIQUE INDEX "Photo_pkey" ON public."Photo" USING btree (id);

CREATE UNIQUE INDEX "Pokemon_pkey" ON public."Pokemon" USING btree (id);

CREATE UNIQUE INDEX "Profile_pkey" ON public."Profile" USING btree (id);

CREATE UNIQUE INDEX "Profile_userId_key" ON public."Profile" USING btree ("userId");

CREATE UNIQUE INDEX "Review_pkey" ON public."Review" USING btree (id);

CREATE UNIQUE INDEX "Secret_pkey" ON public."Secret" USING btree (id);

CREATE UNIQUE INDEX "Todo_pkey" ON public."Todo" USING btree (id);

CREATE UNIQUE INDEX "_Friendship_AB_pkey" ON public."_Friendship" USING btree ("A", "B");

CREATE INDEX "_Friendship_B_index" ON public."_Friendship" USING btree ("B");

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

alter table "public"."Attachment" add constraint "Attachment_pkey" PRIMARY KEY using index "Attachment_pkey";

alter table "public"."Food" add constraint "Food_pkey" PRIMARY KEY using index "Food_pkey";

alter table "public"."FriendRequest" add constraint "FriendRequest_pkey" PRIMARY KEY using index "FriendRequest_pkey";

alter table "public"."Note" add constraint "Note_pkey" PRIMARY KEY using index "Note_pkey";

alter table "public"."Photo" add constraint "Photo_pkey" PRIMARY KEY using index "Photo_pkey";

alter table "public"."Pokemon" add constraint "Pokemon_pkey" PRIMARY KEY using index "Pokemon_pkey";

alter table "public"."Profile" add constraint "Profile_pkey" PRIMARY KEY using index "Profile_pkey";

alter table "public"."Review" add constraint "Review_pkey" PRIMARY KEY using index "Review_pkey";

alter table "public"."Secret" add constraint "Secret_pkey" PRIMARY KEY using index "Secret_pkey";

alter table "public"."Todo" add constraint "Todo_pkey" PRIMARY KEY using index "Todo_pkey";

alter table "public"."_Friendship" add constraint "_Friendship_AB_pkey" PRIMARY KEY using index "_Friendship_AB_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."FriendRequest" add constraint "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Profile"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."FriendRequest" validate constraint "FriendRequest_receiverId_fkey";

alter table "public"."FriendRequest" add constraint "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."FriendRequest" validate constraint "FriendRequest_senderId_fkey";

alter table "public"."Review" add constraint "Review_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Review" validate constraint "Review_foodId_fkey";

alter table "public"."Review" add constraint "Review_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Review" validate constraint "Review_pokemonId_fkey";

alter table "public"."_Friendship" add constraint "_Friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_Friendship" validate constraint "_Friendship_A_fkey";

alter table "public"."_Friendship" add constraint "_Friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_Friendship" validate constraint "_Friendship_B_fkey";

grant delete on table "public"."Attachment" to "authenticated";

grant insert on table "public"."Attachment" to "authenticated";

grant select on table "public"."Attachment" to "authenticated";

grant update on table "public"."Attachment" to "authenticated";

grant delete on table "public"."Food" to "authenticated";

grant insert on table "public"."Food" to "authenticated";

grant select on table "public"."Food" to "authenticated";

grant update on table "public"."Food" to "authenticated";

grant delete on table "public"."FriendRequest" to "authenticated";

grant insert on table "public"."FriendRequest" to "authenticated";

grant select on table "public"."FriendRequest" to "authenticated";

grant update on table "public"."FriendRequest" to "authenticated";

grant delete on table "public"."Note" to "authenticated";

grant insert on table "public"."Note" to "authenticated";

grant select on table "public"."Note" to "authenticated";

grant update on table "public"."Note" to "authenticated";

grant delete on table "public"."Photo" to "authenticated";

grant insert on table "public"."Photo" to "authenticated";

grant select on table "public"."Photo" to "authenticated";

grant update on table "public"."Photo" to "authenticated";

grant delete on table "public"."Pokemon" to "authenticated";

grant insert on table "public"."Pokemon" to "authenticated";

grant select on table "public"."Pokemon" to "authenticated";

grant update on table "public"."Pokemon" to "authenticated";

grant delete on table "public"."Profile" to "authenticated";

grant insert on table "public"."Profile" to "authenticated";

grant select on table "public"."Profile" to "authenticated";

grant update on table "public"."Profile" to "authenticated";

grant delete on table "public"."Review" to "authenticated";

grant insert on table "public"."Review" to "authenticated";

grant select on table "public"."Review" to "authenticated";

grant update on table "public"."Review" to "authenticated";

grant delete on table "public"."Secret" to "authenticated";

grant insert on table "public"."Secret" to "authenticated";

grant select on table "public"."Secret" to "authenticated";

grant update on table "public"."Secret" to "authenticated";

grant delete on table "public"."Todo" to "authenticated";

grant insert on table "public"."Todo" to "authenticated";

grant select on table "public"."Todo" to "authenticated";

grant update on table "public"."Todo" to "authenticated";

grant delete on table "public"."_Friendship" to "authenticated";

grant insert on table "public"."_Friendship" to "authenticated";

grant select on table "public"."_Friendship" to "authenticated";

grant update on table "public"."_Friendship" to "authenticated";

grant delete on table "public"."_prisma_migrations" to "authenticated";

grant insert on table "public"."_prisma_migrations" to "authenticated";

grant select on table "public"."_prisma_migrations" to "authenticated";

grant update on table "public"."_prisma_migrations" to "authenticated";

create policy "Enable insert for authenticated users only"
on "public"."Attachment"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."Attachment"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."Secret"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."Todo"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."Todo"
as permissive
for select
to authenticated
using (true);



