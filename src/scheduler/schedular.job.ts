import schedule from "node-schedule";
import prisma from "../prisma";
import { getUserDataById } from "../service/user.service";

// schedule on the basis of time
const rule = new schedule.RecurrenceRule();
rule.hour = 1;
// const rule = "*/10 * * * * *"  // every 10 seconds

const jobScheduler = schedule.scheduleJob(rule, async () => {
  console.log("Job Run : ", new Date().toLocaleString());

  const userId = await getUserDataById("7a675d74-f79b-42f2-a89e-d39fafce1db8");

  if (userId) {
    const result = await prisma.user.delete({
      where: {
        id: userId.id,
      },
    });

    if (result) {
      console.log("User deleted successfully");
    }
  }
});

const job = {
  jobScheduler,
};

export default job;
