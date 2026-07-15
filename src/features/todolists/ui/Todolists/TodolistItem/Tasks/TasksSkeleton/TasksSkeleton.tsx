import { Task_Count } from "@/common/constants"
import Skeleton from "@mui/material/Skeleton"
import styles from "./TasksSkeleton.module.css"

const TASK_LINE_WIDTH = "65%"

export const TasksSkeleton = () => (
  <div className={styles.container}>
    {Array.from({ length: Task_Count }, (_, id) => (
      <div key={id} className={styles.taskRow}>
        <Skeleton
          variant="rounded"
          width={20}
          height={20}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          variant="rounded"
          height={14}
          sx={{ width: TASK_LINE_WIDTH }}
        />
      </div>
    ))}
  </div>
)
