-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "skill" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);
