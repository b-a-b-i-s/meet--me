-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."Date" (
    "MeetingId" int4 NOT NULL,
    "DateId" int4 NOT NULL,
    "StartDate" timestamp NOT NULL,
    "EndDate" timestamp NOT NULL,
    CONSTRAINT "Date_fk0" FOREIGN KEY ("MeetingId") REFERENCES "public"."Meeting"("MeetingId"),
    PRIMARY KEY ("MeetingId","DateId")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS "Meeting_MeetingId_seq"

-- Table Definition
CREATE TABLE "public"."Meeting" (
    "MeetingId" int4 NOT NULL DEFAULT nextval('"Meeting_MeetingId_seq"'::regclass),
    "MeetingState" varchar NOT NULL,
    "MeetingTitle" varchar NOT NULL,
    "MeetingDescription" text NOT NULL,
    "MeetingDateCreated" timestamp NOT NULL,
    "MeetingSingleVote" bool NOT NULL,
    "MeetingUrl" varchar NOT NULL DEFAULT 'NULL'::character varying,
    "MeetingCreator" int4 NOT NULL,
    PRIMARY KEY ("MeetingId")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS "Signed User_SignedUserId_seq"

-- Table Definition
CREATE TABLE "public"."Signed User" (
    "SignedUserId" int4 NOT NULL DEFAULT nextval('"Signed User_SignedUserId_seq"'::regclass),
    "UserName" varchar NOT NULL,
    "UserEmail" varchar NOT NULL,
    "UserPassword" varchar NOT NULL,
    PRIMARY KEY ("SignedUserId")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS "Temporary User_TempId_seq"

-- Table Definition
CREATE TABLE "public"."Temporary User" (
    "TempId" int4 NOT NULL DEFAULT nextval('"Temporary User_TempId_seq"'::regclass),
    "TempName" varchar NOT NULL
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS "User_UserId_seq"

-- Table Definition
CREATE TABLE "public"."User" (
    "UserId" int4 NOT NULL DEFAULT nextval('"User_UserId_seq"'::regclass),
    "TempId" int4,
    "SignedUserId" int4,
    CONSTRAINT "User_fk0" FOREIGN KEY ("TempId") REFERENCES "public"."Temporary User"("TempId"),
    CONSTRAINT "User_fk1" FOREIGN KEY ("SignedUserId") REFERENCES "public"."Signed User"("SignedUserId"),
    PRIMARY KEY ("UserId")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS "Vote_VoteId_seq"

-- Table Definition
CREATE TABLE "public"."Vote" (
    "VoteId" int4 NOT NULL DEFAULT nextval('"Vote_VoteId_seq"'::regclass),
    "MeetingId" int4 NOT NULL,
    "UserIdVote" int4 NOT NULL,
    "VoteDateId" int4 NOT NULL,
    CONSTRAINT "Vote_fk0" FOREIGN KEY ("MeetingId") REFERENCES "public"."Meeting"("MeetingId"),
    CONSTRAINT "Vote_fk1" FOREIGN KEY ("UserIdVote") REFERENCES "public"."User"("UserId"),
    PRIMARY KEY ("VoteId","MeetingId")
);


CREATE OR REPLACE FUNCTION public.addsigneduser()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN 
INSERT INTO "User" ("SignedUserId") VALUES (NEW."SignedUserId");
RETURN NEW;
END;
$function$


CREATE OR REPLACE FUNCTION public.addtempuser()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN 
INSERT INTO "User" ("TempId") VALUES (NEW."TempId");
RETURN NEW;
END;
$function$



