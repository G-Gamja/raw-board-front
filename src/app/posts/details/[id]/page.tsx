"use client";

import { deleteCommentById, getComments, writeComment } from "@/utils/comments";
import { deletePostById, getPostById, updatePostById } from "@/utils/posts";
import { useEffect, useMemo, useState } from "react";

import { AxiosError } from "axios";
import { Comment } from "@/types/comments";
import { Post } from "@/types/post";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

export default function Details({ params }: { params: { id: number } }) {
  const router = useRouter();

  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputContent, setInputContent] = useState<string>("");

  const [inputComment, setInputComment] = useState("");

  const [fetchedPost, setFetchedPost] = useState<Post>();

  const [fetchedComments, setFetchedComments] = useState<Comment[]>([]);

  const [isDesc, setIsDesc] = useState<boolean>(true);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const dateTimte = useMemo(
    () =>
      fetchedPost
        ? new Date(fetchedPost.updated_at || fetchedPost.created_at)
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/. /g, ".")
            .replace(/: /g, ":")
        : "",
    [fetchedPost]
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPostById(params.id);

      setFetchedPost(data);

      const commentsResponse = await getComments(params.id, isDesc);

      setFetchedComments(commentsResponse);
    };

    fetchData();
  }, [params.id, isButtonClicked, isDesc]);

  return (
    <main className={styles.main}>
      <button
        onClick={() => {
          router.push(`/posts/1`);
        }}
      >
        go Back
      </button>
      <div className={styles.postsWrapper}>
        <div className={styles.postItem}>
          <div className={styles.postTitle}>{fetchedPost?.title}</div>
          <div className={styles.postBody}>{fetchedPost?.content}</div>
          <div className={styles.postBody}>{dateTimte}</div>
        </div>
        {/* NOTE 로그인한 유저가 작성한 게시물이 아니면 수정, 삭제 버튼이 보이지 않도록 구현 */}
      </div>
      <p>댓글</p>
      <div className={styles.commentsWrapper}>
        {fetchedComments.map((comment) => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.commentBody}>{comment.commment_content}</div>
            <div className={styles.commentBody}>
              {comment.updated_at || comment.created_at}
            </div>
            <div className={styles.commentBody}>{comment.email}</div>
            <button
              onClick={async (e) => {
                e.stopPropagation();

                try {
                  const response = await deleteCommentById(comment.id);

                  if ((response as { data?: string })?.data === "SUCCESS") {
                    alert("댓글 삭제에 성공했습니다.");
                    setIsButtonClicked(!isButtonClicked);
                  }
                } catch (error) {
                  if (error instanceof AxiosError) {
                    alert(error.response?.data.message);
                  }
                }
              }}
            >
              erase comment
            </button>
          </div>
        ))}
      </div>

      <button
        className={styles.sortButton}
        onClick={() => {
          setIsDesc(!isDesc);
        }}
      >
        {isDesc ? "댓글 오름차순" : "댓글 내림차순"}
      </button>
      <button
        onClick={async (e) => {
          e.stopPropagation();
          if (fetchedPost === undefined) return;

          try {
            const response = await deletePostById(fetchedPost.id);
            if ((response as { data?: string })?.data === "SUCCESS") {
              alert("게시물 삭제에 성공했습니다.");
              router.push(`/posts/1`);
            }
          } catch (error) {
            if (error instanceof AxiosError) {
              alert(error.response?.data.message);
            }
          }
        }}
      >
        erase
      </button>
      {/* TODO 본인이 작성한 post만 수정, 삭제 가능하도록 숨기기 */}
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
        onClick={async (e) => {
          if (fetchedPost === undefined) return;

          const response = await updatePostById(
            fetchedPost.id,
            inputTitle,
            inputContent
          );

          //@ts-ignore
          if (response?.response?.error) {
            //@ts-ignore
            alert(response.response.error);
            return;
          }

          if ((response as { data?: string })?.data === "SUCCESS") {
            alert("게시물 수정에 성공했습니다.");
            setIsButtonClicked(!isButtonClicked);
          }
        }}
      >
        post update
      </button>

      <input
        type="text"
        onChange={(input) => {
          setInputComment(input.target.value);
        }}
        placeholder="comment"
        className={styles.input}
      />
      <button
        onClick={async (e) => {
          if (fetchedPost === undefined) return;

          const response = await writeComment(fetchedPost.id, inputComment);

          //@ts-ignore
          if (response?.response?.error) {
            //@ts-ignore
            alert(response.response.error);
            return;
          }

          if ((response as { data?: string })?.data === "SUCCESS") {
            alert("덧글 작성에 성공했습니다.");
            setIsButtonClicked(!isButtonClicked);
          }
        }}
      >
        write comment
      </button>
    </main>
  );
}
