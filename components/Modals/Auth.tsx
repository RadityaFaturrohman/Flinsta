"use client";

import React, { useEffect, useRef, useState } from 'react'
import AuthInput from '../AuthInput'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { cn } from '@/utils/utils';

const contentAnimate = {
  inital: {

  }
}

const Auth = () => {
  const [type, setType] = useState<'signIn' | 'signUp'>('signIn');
  const [contentHeight, setContentHeight] = useState<number>(0)

  const changeContent = (content: 'signIn' | 'signUp') => {
    setType(content);
  }

  return (
    <div className='p-4'>
      <div className={twMerge('flex flex-col gap-3 items-center w-fit p-8 px-12 pb-7 cursor-default h-auto transition-all', type === 'signUp' && `py-4`)}>
        {type === 'signUp' ? (
          <SignUp changeContent={changeContent} />
        ) : (
          <SignIn changeContent={changeContent} />
        )}
      </div>
    </div>
  )
};

const SignUp = ({ changeContent }: { changeContent: (content: 'signIn' | 'signUp') => void }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [usernameError, setUsernameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  const checkEmail = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!email.length) {
      setEmailError('Please enter a valid email');
    } else if (!emailRegex.test(email)) {
      setEmailError('please use a valid email address');
    } else {
      return true;
    }
  }

  const checkPassword = () => {
    if (!password.length || !confirmPassword.length) {
      setPasswordError('Please enter a password');
      setConfirmPasswordError('Please enter a password');
    } else if (password.length < 8 || confirmPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Password does not match');
    } else {
      true
    }
  }

  const { mutate: signUpFn } = useMutation({
    mutationFn: async ({ username, email, password }: { username: string, email: string, password: string }) => {
      const payload = {
        username,
        email,
        password,
      };
      const res = await fetch("/api/sign-up", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const resJson = await res.json();
        console.log(resJson)
        return toast.error(resJson.code, {
          description: resJson.message
        });
      } else {

        await signIn("credentials", {
          email: email,
          password: password,
          callbackUrl: "/",
        });
        return toast.success("You're successfully sign up, signing in...");
      }
    },
    onError: () => {
      return toast.error('Something went wrong', {
        description: 'Your sign up has an error, please try again later.'
      });
    },
  });

  const onSubmit = async () => {
    const validEmail = checkEmail();
    const validPassword = checkPassword();

    const payload = {
      username: username,
      email: email,
      password: password,
    };

    signUpFn(payload);
  };

  const [isLoading, setIsLoading] = React.useState<boolean | null>(null);

  async function oauthSignIn() {
    try {
      setIsLoading(true);
      await signIn("google"), {
        callback: "/",
      };
      toast.success('Successfully signed in');
    } catch (error: any) {
      setIsLoading(false);
      toast.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <p className='text-lg text-primary font-bold'>app logo</p>

      <div className='flex flex-col gap-2 w-[300px] items-center'>
        <p className='text-dark text-[17px] font-semibold'>Join Our Exclusive Community!</p>
        <p className='text-dark text-opacity-45 font-semibold text-[11px] text-center'>New to Flinsta? Sign up now to start saving your favorite ideas, and discovering inspiration.</p>
      </div>

      <div className='flex flex-col gap-3 mt-2'>
        <AuthInput
          icon='mingcute:user-2-fill'
          label='Username'
          value={username}
          setValue={setUsername}
        />

        <AuthInput
          icon='ic:baseline-email'
          label='Email'
          value={email}
          setValue={setEmail}
        />

        <AuthInput
          icon='mingcute:lock-fill'
          label='Password'
          value={password}
          setValue={setPassword}
          passwordToggle
        />

        <AuthInput
          icon='mingcute:unlock-fill'
          label='Confirm Password'
          value={confirmPassword}
          setValue={setConfirmPassword}
          passwordToggle
        />
      </div>

      <motion.button onClick={() => onSubmit()} whileTap={{ scale: .95, transition: { type: 'linear' } }} className='w-full bg-dark rounded-xl text-xs font-normal py-3.5 mt-4'>
        Create My Account
      </motion.button>

      <p className='text-dark text-opacity-55 font-medium text-xs my-1'>or continue with</p>

      <div className='w-full flex items-center gap-[2px]'>
        <Providers />
      </div>

      <p className='w-[300px] text-dark text-opacity-50 font-medium text-[11px] mt-4'>Your privacy matters. We keep your data secure and never share it.</p>

      <div className='flex items-center gap-1 text-[11px] text-dark mt-4 font-medium'>
        <p className='text-opacity-55'>already have an account?</p>
        <button onClick={() => changeContent('signIn')} className='font-bold tracking-wide text-xs underline'>Sign In</button>
      </div>
    </>
  )
}

const SignIn = ({ changeContent }: { changeContent: (content: 'signIn' | 'signUp') => void }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const contentRef = useRef<any>(null);

  useEffect(() => {
    changeContent('signIn')
  })

  const checkEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.length === 0) {
      setEmailError('You must provide a valid email address')
    } else if (!emailRegex.test(email)) {
      setEmailError('You must provide a valid email address')
    } else {
      return true;
    }
  }

  const checkPassword = () => {
    if (password.length === 0) {
      setPasswordError('You must provide a valid password')
    } else {
      return true;
    }
  }

  const router = useRouter();

  const { mutate: signInFn } = useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {

      const res = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
        callbackUrl: "/"
      });
      if (!res?.ok) {
        return toast.error('Something went wrong', {
          description: "Your credentials doesn't match our records.",
        })
      } else {
        router.back();
        // router.refresh();
        return toast.success("You're successfully sign in, now redirecting..");
      }
    },
    onError: () => {
      return toast.error('Something went wrong', {
        description: 'Your sign in has an error, please try again.'
      })
    },
  });

  const validate = () => {
    // const isEmailValid = checkEmail();
    // const isPasswordValid = checkPassword();

    // if (isEmailValid && isPasswordValid) {
      onSubmit();
    // }
  }

  const onSubmit = async () => {
    const payload: { email: string, password: string } = {
      email: email,
      password: password,
    };

    signInFn(payload);
  };

  return (
    <motion.div className='w-full h-full flex flex-col gap-3 items-center' ref={contentRef}>
      <p className='text-lg text-primary font-bold text-center'>app logo</p>

      <div className='flex flex-col gap-2 w-[300px] items-center'>
        <p className='text-dark text-[17px] font-semibold'>Welcome Back!</p>
        <p className='text-dark text-opacity-45 font-semibold text-[11px] text-center'>Already a part of the Flinsta community? Sign in here to explore your boards and discover new content.</p>
      </div>

      <div className='flex flex-col gap-3 mt-2'>
        <AuthInput
          icon='ic:baseline-email'
          label='Email'
          value={email}
          setValue={setEmail}
          error={emailError}
          setError={setEmailError}
        />

        <div className='flex flex-col items-end gap-1'>
          <AuthInput
            icon='mingcute:lock-fill'
            label='Password'
            value={password}
            setValue={setPassword}
            passwordToggle
            error={passwordError}
            setError={setPasswordError}
          />
          <button className='text-black text-opacity-55 text-[10px] font-semibold underline hover:text-opacity-75 transition-all'>forgot password?</button>
        </div>
      </div>

      <motion.button onClick={() => validate()} whileTap={{ scale: .95, transition: { type: 'linear' } }} className='w-full bg-dark rounded-xl text-xs font-normal py-3.5 mt-2.5'>
        Login
      </motion.button>

      <p className='text-dark text-opacity-55 font-medium text-xs my-1'>or continue with</p>

      <div className='w-full flex items-center gap-[2px]'>
        <Providers />
      </div>

      <p className='w-[300px] text-dark text-opacity-50 font-medium text-[11px] mt-4'>Your privacy matters. We keep your data secure and never share it.</p>

      <div className='flex items-center gap-1 text-[11px] text-dark mt-4 font-medium'>
        <p className='text-opacity-55'>{"Didn't have an account?"}</p>
        <button onClick={() => changeContent('signUp')} className='font-bold tracking-wide text-xs underline'>Create Account</button>
      </div>
    </motion.div>
  )
}

const Providers = () => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function oauthSignIn(provider: string) {
    try {
      setIsLoading(true);
      await signIn(provider);
      toast.success('Successfully signed in');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(`Error signing in with ${provider}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }


  const providers = [
    {
      icon: 'flat-color-icons:google',
      label: 'Google',
      provider: 'google',
    },
    {
      icon: 'logos:discord-icon',
      label: 'Discord',
      provider: 'discord',
    },
    {
      icon: 'bi:github',
      label: 'Github',
      provider: 'github',
    }
  ];

  return (
    <>
      {providers.map((item, index) => (
        <button
          key={index}
          className='w-full py-2 rounded-lg border border-black border-opacity-15 flex items-center justify-center'
          onClick={() => oauthSignIn(item.provider)}
          disabled={isLoading}
        >
          <Icon icon={item.icon} className={cn('text-[22px] text-black', item.provider === 'discord' && 'text-lg')} />
        </button>
      ))}
    </>
  );
};

export default Auth