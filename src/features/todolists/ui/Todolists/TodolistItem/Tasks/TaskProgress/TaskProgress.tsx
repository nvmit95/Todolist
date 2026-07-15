import styles from "./TaskProgress.module.css"

type Props = {
  completedCount: number
  totalCount: number
  percent: number
}

export const TaskProgress = ({
  completedCount,
  totalCount,
  percent,
}: Props) => {
  if (totalCount === 0) return null

  return (
    <div
      className={styles.container}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${completedCount} of ${totalCount} tasks completed`}
    >
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.label}>
        {completedCount}/{totalCount}
      </span>
    </div>
  )
}
