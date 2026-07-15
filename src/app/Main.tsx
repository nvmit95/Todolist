import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import AddIcon from "@mui/icons-material/Add"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import styles from "./Main.module.css"

export const Main = () => {
  const [addTodolist] = useAddTodolistMutation()

  return (
    <Container maxWidth="lg" className={styles.main}>
      <Box className={styles.hero}>
        <Typography variant="h4" className={styles.title}>
          My Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
          Organize your day, one list at a time
        </Typography>
      </Box>

      <Grid container className={styles.createSection}>
        <CreateItemForm
          onCreateItem={addTodolist}
          placeholder="Create a new list..."
          buttonIcon={<AddIcon />}
        />
      </Grid>

      <Todolists />
    </Container>
  )
}
