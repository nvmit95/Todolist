import { Task_Count } from "@/common/constants"
import Paper from "@mui/material/Paper"
import Skeleton from "@mui/material/Skeleton"
import styles from "./TodolistSkeleton.module.css"

const TASK_LINE_WIDTH = "65%"

export const TodolistSkeleton = () => (
  <Paper className={styles.container} elevation={0}>
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Skeleton variant="rounded" height={22} sx={{ width: "55%" }} />
          <Skeleton variant="circular" width={24} height={24} />
        </div>
        <div className={styles.progressRow}>
          <Skeleton variant="rounded" height={4} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" width={28} height={12} />
        </div>
      </div>

      <div className={styles.createRow}>
        <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" width={40} height={40} />
      </div>

      <div className={styles.tasks}>
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

      <div className={styles.footer}>
        <div className={styles.filters}>
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
        </div>
      </div>
    </div>
  </Paper>
)
