import Router from "next/router";
import React, { useCallback, FormEvent, FC } from "react";
import { useMutation } from "@apollo/client";
import { useInput } from "../../hooks";
import { logInMutation } from "../../graphql/auth/mutation/login";
import SignInPresenter from "./SignInPresenter";
import { setAccessToken } from "../../lib/token";

const SignInContainer: FC = () => {
  const [login, { loading }] = useMutation(logInMutation);
  const email = useInput("");
  const pwd = useInput("");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (loading) return;
      try {
        await login({
          variables: { email: email.value, pwd: pwd.value },
          update: (_, { data }) => {
            if (data && data.logIn) {
              setAccessToken(data.logIn);
              Router.push("/");
            }
          }
        });
      } catch (error) {
        const { message } = JSON.parse(error.message);
        alert(message);
      }
    },
    [email.value, pwd.value, loading]
  );

  return (
    <SignInPresenter
      loading={loading}
      email={email}
      pwd={pwd}
      onSubmit={handleSubmit}
    />
  );
};

export default SignInContainer;