import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-widgets';
import { useTwitterLibrary } from '@/hooks/useTwitterLibrary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TwitterLibrary() {
  const { toast } = useToast();
  const { tweets, isLoading, addTweet, deleteTweet } = useTwitterLibrary();
  const [newTweetUrl, setNewTweetUrl] = React.useState('');

  const extractTweetId = (url: string) => {
    const regex = /status\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAddTweet = async () => {
    const tweetId = extractTweetId(newTweetUrl);
    if (!tweetId) {
      toast({
        title: "כתובת URL לא תקינה",
        description: "אנא הכנס כתובת URL תקינה של ציוץ",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTweet.mutateAsync({
        tweetId,
        url: newTweetUrl,
      });
      setNewTweetUrl('');
    } catch (error) {
      console.error('Error adding tweet:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">ספריית ציוצים</h2>
      
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newTweetUrl}
          onChange={(e) => setNewTweetUrl(e.target.value)}
          placeholder="הכנס כתובת URL של ציוץ"
          className="flex-1"
        />
        <Button 
          onClick={handleAddTweet} 
          disabled={addTweet.isPending}
        >
          {addTweet.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          הוסף ציוץ
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => deleteTweet.mutate(tweet.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <TwitterTweetEmbed tweetId={tweet.tweet_id} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}