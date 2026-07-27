-- CreateTable
CREATE TABLE "resourceTutorial" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "skill" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "resourceTutorial_pkey" PRIMARY KEY ("id")
);
