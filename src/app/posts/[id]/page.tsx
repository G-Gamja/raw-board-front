"use client";

import { getPosts, writePost } from "@/utils/posts";
import { useEffect, useState } from "react";

import { Post } from "@/types/post";
import { User } from "@/types/user";
import { getUser } from "@/utils/user";
import { logOut } from "@/utils/auth";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

// FIXME 페이지 이동시에 isDesc변수가 초기화 되어버림. 로컬스토리지에 저장해야할듯
export default function Posts({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputContent, setInputContent] = useState<string>("");
  const [inputSearch, setInputSearch] = useState("");

  const [isWritePostClicked, setIsWritePostClicked] = useState(false);

  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);

  const [fetchedUser, setFetchedUser] = useState<User>();

  const [isDesc, setIsDesc] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPosts(
        Number(params.id),
        undefined,
        isDesc,
        inputSearch
      );
      setFetchedPosts(data);

      const userData = await getUser();

      setFetchedUser(userData[0]);
    };

    fetchData();
  }, [isDesc, params.id, isWritePostClicked, inputSearch]);

  // TODO 총 페이지 수를 받아와서 다음 페이지 버튼을 비활성화 시키는 로직 구현
  return (
    <main className={styles.main}>
      <div
        className={styles.header}
        onClick={() => {
          router.push(`/account/my`);
        }}
      >
        {fetchedUser?.email}
        &nbsp;/&nbsp;
        {fetchedUser?.username}
      </div>
      <input
        type="text"
        onChange={(input) => {
          setInputSearch(input.target.value);
        }}
        placeholder="search"
        className={styles.searchInput}
      />
      <div className={styles.postsWrapper}>
        {fetchedPosts.map((post) => {
          const a = new Date(post.updated_at || post.created_at)
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/. /g, ".")
            .replace(/: /g, ":");
          return (
            <div
              className={styles.postItem}
              key={post.id}
              onClick={() => {
                router.push(`/posts/details/${post.id}`);
              }}
            >
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postBody}>{post.content}</div>
              <div className={styles.postBody}>{post.email}</div>
              <div className={styles.postBody}>{a}</div>
              <div className={styles.postBody}>{post.id}</div>
              {post.updated_at && (
                <div className={styles.postBody}>{"is Edited"}</div>
              )}
            </div>
          );
        })}
      </div>
      <button
        className={styles.sortButton}
        onClick={() => {
          setIsDesc(!isDesc);
        }}
      >
        {isDesc ? "오름차순" : "내림차순"}
      </button>
      <button
        className={styles.sortButton}
        onClick={() => {
          router.push(`/posts/${Number(params.id) + 1}`);
        }}
      >
        {"다음 페이지"}
      </button>
      <button
        className={styles.sortButton}
        onClick={() => {
          router.push(`/posts/${Number(params.id) - 1}`);
        }}
      >
        {"이전 페이지"}
      </button>
      <input
        type="text"
        onChange={(input) => {
          setInputTitle(input.target.value);
        }}
        placeholder="title"
        className={styles.input}
      />
      <input
        type="text"
        onChange={(input) => {
          setInputContent(input.target.value);
        }}
        placeholder="content"
        className={styles.input}
      />
      <button
        className={styles.sortButton}
        onClick={async () => {
          if (!!inputTitle && !!inputContent) {
            const response = await writePost(inputTitle, inputContent);

            if ((response as { data?: string })?.data === "SUCCESS") {
              alert("게시물 작성에 성공했습니다.");
              setIsWritePostClicked(!isWritePostClicked);
            }
          }
        }}
      >
        {"게시물 작성"}
      </button>

      <button
        className={styles.sortButton}
        onClick={async () => {
          const response = await logOut();

          // @ts-ignore
          if (response.data === "SUCCESS") {
            alert("로그아웃에 성공했습니다.");
            router.push("/auth/login");
          }
        }}
      >
        {"로그아웃"}
      </button>
    </main>
  );
}
