"use client";

import { AxiosError } from "axios";
import { post } from "@/utils/axios";
import { register } from "@/utils/auth";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";

// FIXME 최초 진입 쪽에 Wrapper로 구현하고 만약 쿠키가 없으면 로그인 페이지로 이동하게 구현

// FIXME 가입 페이지도 구현

// FIXME 로그인시에 auth정보를 전역변수에 저장해야하나 쿠키에 저장해야하나 고민
export default function Register() {
  const router = useRouter();
  const [inputId, setInputId] = useState<string>();
  const [inputUsername, setInputUsername] = useState<string>();
  const [inputPassword, setInputPassword] = useState<string>();

  const login = async (id?: string, password?: string) => {
    const data = await post("/api/auth/log-in", {
      email: id,
      password: password,
    });

    if ((data as any).data === "SUCCESS") {
      router.push("/posts/1");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>Register</h1>
      </div>

      <input
        type="text"
        onChange={(input) => {
          setInputId(input.target.value);
        }}
        placeholder="email"
        className={styles.input}
      />
      <input
        type="text"
        onChange={(input) => {
          setInputUsername(input.target.value);
        }}
        placeholder="username"
        className={styles.input}
      />
      <input
        type="password"
        onChange={(input) => {
          setInputPassword(input.target.value);
        }}
        placeholder="password"
        className={styles.input}
      />

      <button
        className={styles.loginButton}
        onClick={async () => {
          try {
            if (inputId && inputPassword && inputUsername) {
              const response = await register(
                inputId,
                inputUsername,
                inputPassword
              );

              if ((response as { data?: string })?.data === "SUCCESS") {
                alert("회원가입 성공");
                router.push("/auth/login");
              }
            }
          } catch (error) {
            if (error instanceof AxiosError) {
              alert(error.response?.data.message);
            }
          }
        }}
      >
        register
      </button>
    </main>
  );
}
