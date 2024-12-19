import React, { useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { useTwitterLibrary } from '@/hooks/useTwitterLibrary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';

export function TwitterLibrary() {
  const [newTweetUrl, setNewTweetUrl] = useState('');
  const { tweets, isLoading, addTweet, deleteTweet } = useTwitterLibrary();

  const extractTweetId = (url: string): string | null => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleAddTweet = async () => {
    const tweetId = extractTweetId(newTweetUrl);
    if (!tweetId) return;

    await addTweet.mutateAsync({
      tweetId,
      url: newTweetUrl,
    });
    setNewTweetUrl('');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={newTweetUrl}
            onChange={(e) => setNewTweetUrl(e.target.value)}
            placeholder="הכנס קישור לציוץ"
            className="flex-1"
          />
          <Button 
            onClick={handleAddTweet}
            disabled={!newTweetUrl || addTweet.isPending}
          >
            {addTweet.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'הוסף ציוץ'
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="relative bg-white rounded-lg shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => deleteTweet.mutate(tweet.id)}
                disabled={deleteTweet.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <TwitterTweetEmbed tweetId={tweet.tweet_id} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}