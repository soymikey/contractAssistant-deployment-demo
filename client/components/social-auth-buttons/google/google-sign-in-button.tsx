import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { expo } from '@/app.json';
import { Text } from '@react-navigation/elements';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  function extractParamsFromUrl(url: string) {
    const parsedUrl = new URL(url);
    const hash = parsedUrl.hash.substring(1); // Remove the leading '#'
    const params = new URLSearchParams(hash);

    return {
      access_token: params.get('access_token'),
      expires_in: parseInt(params.get('expires_in') || '0'),
      refresh_token: params.get('refresh_token'),
      token_type: params.get('token_type'),
      provider_token: params.get('provider_token'),
      code: params.get('code'),
    };
  }

  async function onSignInButtonPress() {
    console.debug('onSignInButtonPress - start');
    const res = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${expo.scheme}://google-auth`,
        queryParams: { prompt: 'consent' },
        skipBrowserRedirect: true,
      },
    });
    const googleOAuthUrl = res.data.url;

    if (!googleOAuthUrl) {
      console.error('no oauth url found!');
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      googleOAuthUrl,
      `${expo.scheme}://google-auth`,
      { showInRecents: true }
    ).catch((err) => {
      console.error('onSignInButtonPress - openAuthSessionAsync - error', { err });
      console.log(err);
    });
    console.debug('onSignInButtonPress - openAuthSessionAsync - result', { result });
    if (result && result.type === 'success') {
      console.debug('onSignInButtonPress - openAuthSessionAsync - success');
      const params = extractParamsFromUrl(result.url);
      console.debug('onSignInButtonPress - openAuthSessionAsync - success', { params });

      if (params.access_token && params.refresh_token) {
        console.debug('onSignInButtonPress - setSession');
        const { data, error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        console.debug('onSignInButtonPress - setSession - success', { data, error });
        return;
      } else {
        console.error('onSignInButtonPress - setSession - failed');
        // sign in/up failed
      }
    } else {
      console.error('onSignInButtonPress - openAuthSessionAsync - failed');
    }
  }

  // to warm up the browser
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={onSignInButtonPress}
      style={{
        flex: 1,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
      }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjIuNTYgMTIuMjVjMC0uNzgtLjA3LTEuNTMtLjItMi4yNUgxMnY0LjI2aDUuOTJjLS4yNiAxLjM3LTEuMDQgMi41My0yLjIxIDMuMzF2Mi43N2gzLjU3YzIuMDgtMS45MiAzLjI4LTQuNzQgMy4yOC04LjA5eiIgZmlsbD0iIzQyODVGNCI+PC9wYXRoPjxwYXRoIGQ9Ik0xMiAyM2MyLjk3IDAgNS40Ni0uOTggNy4yOC0yLjY2bC0zLjU3LTIuNzdjLS45OC42Ni0yLjIzIDEuMDYtMy43MSAxLjA2LTIuODYgMC01LjI5LTEuOTMtNi4xNi00LjUzSDIuMTh2Mi44NEMzLjk5IDIwLjUzIDcuNyAyMyAxMiAyM3oiIGZpbGw9IiMzNEE4NTMiPjwvcGF0aD48cGF0aCBkPSJNNS44NCAxNC4wOWMtLjIyLS42Ni0uMzUtMS4zNi0uMzUtMi4wOXMuMTMtMS40My4zNS0yLjA5VjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEyczAuNDMgMy40NSAxLjE4IDQuOTNsMi44NS0yLjIyLjgxLS42MnoiIGZpbGw9IiNGQkJDMDUiPjwvcGF0aD48cGF0aCBkPSJNMTIgNS4zOGMxLjYyIDAgMy4wNi41NiA0LjIxIDEuNjRsMy4xNS0zLjE1QzE3LjQ1IDIuMDkgMTQuOTcgMSAxMiAxIDcuNyAxIDMuOTkgMy40NyAyLjE4IDcuMDdsMy42NiAyLjg0Yy44Ny0yLjYgMy4zLTQuNTMgNi4xNi00LjUzeiIgZmlsbD0iI0VBNDMzNSI+PC9wYXRoPjwvc3ZnPg==' }}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
}
