import { setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import {
  useLazyGetCaptchaQuery,
  useLoginMutation,
} from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import styles from "./Login.module.css"

export const Login = () => {
  const [login] = useLoginMutation()
  const [getCaptcha] = useLazyGetCaptchaQuery()

  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null)

  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      captcha: "",
    },
  })

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const res = await login(data)

    if (res.data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedInAC({ isLoggedIn: true }))
      localStorage.setItem(AUTH_TOKEN, res.data.data.token)
      reset()
    }

    // 👇 ВОТ ГЛАВНОЕ
    if (res.data?.resultCode === ResultCode.CaptchaError) {
      const captchaRes = await getCaptcha().unwrap()
      setCaptchaUrl(captchaRes.url)
    }
  }

  return (
    <div className={styles.page}>
      <Paper className={styles.card} elevation={0}>
        <div className={styles.header}>
          <CheckCircleOutlineIcon className={styles.icon} />
          <Typography variant="h5" className={styles.title}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your tasks
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />

          <TextField
            type="password"
            label="Password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
          />

          {captchaUrl && (
            <div className={styles.captcha}>
              <img src={captchaUrl} alt="captcha" className={styles.captchaImg} />
              <TextField
                label="Enter captcha"
                fullWidth
                margin="normal"
                {...register("captcha")}
              />
            </div>
          )}

          <FormControlLabel
            label="Remember me"
            className={styles.rememberMe}
            control={
              <Controller
                name="rememberMe"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Checkbox {...field} checked={value} color="primary" />
                )}
              />
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className={styles.submitBtn}
          >
            Sign in
          </Button>

          <Typography variant="caption" color="text.secondary" className={styles.register}>
            No account?{" "}
            <a
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              Register here
            </a>
          </Typography>
        </form>
      </Paper>
    </div>
  )
}
