import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Video, MonitorPlay, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// 型定義
type MediaType = 'image' | 'video' | 'ad';

interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  duration: number; // 秒数
  size?: string; // px
  thumbnail?: string;
  isAd?: boolean;
  adDurationType?: '15s' | '30s';
}

// モックデータ: 登録済みメディア一覧
const MOCK_MEDIA_LIBRARY: MediaItem[] = [
  { id: '1', name: '0000170574 (1).jpg', type: 'image', duration: 15, size: '1080 x 1920', thumbnail: '/api/placeholder/80/80' },
  { id: '2', name: '0000170573 (2).jpg', type: 'image', duration: 15, size: '1080 x 1920', thumbnail: '/api/placeholder/80/80' },
  { id: '3', name: '正光寺_1231.mp4', type: 'video', duration: 21.17, size: '1080 x 1920', thumbnail: '/api/placeholder/80/80' },
  { id: '4', name: '正光寺_1221.mp4', type: 'video', duration: 21.17, size: '1080 x 1920', thumbnail: '/api/placeholder/80/80' },
  { id: '5', name: 'Tanaka_Kougyou_CM.mp4', type: 'video', duration: 15, size: '1080 x 1920', thumbnail: '/api/placeholder/80/80' },
  { id: '6', name: '307864_small.mp4', type: 'video', duration: 8.33, size: '1080 x 1920', thumbnail: '/api/placeholder/80/80' },
];

// コンポーネント
export default function PlaylistCreator() {
  const [playlist, setPlaylist] = useState<MediaItem[]>([]);
  const [playlistName, setPlaylistName] = useState('');

  // プレイリストにメディアを追加
  const addToPlaylist = (item: MediaItem) => {
    // ユニークIDを付与して追加（同じアイテムを複数回追加できるようにするため）
    const newItem = { ...item, id: `${item.id}-${Date.now()}` };
    setPlaylist([...playlist, newItem]);
  };

  // プレイリストに広告枠を追加
  const addAdSlot = (seconds: 15 | 30) => {
    const newAd: MediaItem = {
      id: `ad-${Date.now()}`,
      name: `RAP自動配信枠 (${seconds}秒)`,
      type: 'ad',
      duration: seconds,
      isAd: true,
      adDurationType: seconds === 15 ? '15s' : '30s',
    };
    setPlaylist([...playlist, newAd]);
  };

  // プレイリストから削除
  const removeFromPlaylist = (itemId: string) => {
    setPlaylist(playlist.filter(item => item.id !== itemId));
  };

  // 合計時間の計算（mm:ss形式）
  const totalDuration = playlist.reduce((acc, item) => acc + item.duration, 0);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
      
      {/* ヘッダーエリア */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">プレイリスト作成</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4">プレイリストを新規作成</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">プレイリスト名</label>
            <input 
              type="text" 
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="プレイリスト名を入力" 
              className="w-full bg-gray-100 border-none rounded px-4 py-3 text-slate-700 focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
            />
          </div>

          {/* メインの2カラムレイアウト */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* 左カラム：メディア選択 & 広告枠追加 */}
            <div className="flex-1 min-w-0">
              
              {/* 広告枠追加エリア (RAP連携) - 新機能 */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MonitorPlay className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-orange-900">RAP連携 広告枠を追加</span>
                  </div>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded font-medium">Auto Ad</span>
                </div>
                <p className="text-xs text-orange-800 mb-3">
                  外部配信サービス「RAP」から自動取得される広告枠を設定します。内容は配信時に決定されます。
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => addAdSlot(15)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-orange-300 hover:bg-orange-100 text-orange-700 font-bold py-2 px-4 rounded transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> 15秒枠
                  </button>
                  <button 
                    onClick={() => addAdSlot(30)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-orange-300 hover:bg-orange-100 text-orange-700 font-bold py-2 px-4 rounded transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> 30秒枠
                  </button>
                </div>
              </div>

              {/* メディア選択リスト */}
              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">メディア選択</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-gray-300 text-slate-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-orange-500">
                    <option>フィルター</option>
                    <option>画像のみ</option>
                    <option>動画のみ</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 w-16 text-center">追加</th>
                        <th className="px-4 py-3">メディア名</th>
                        <th className="px-4 py-3 w-20 text-center">タイプ</th>
                        <th className="px-4 py-3 w-20 text-center">秒数</th>
                        <th className="px-4 py-3 w-24 text-center">サイズ (px)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_MEDIA_LIBRARY.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => addToPlaylist(item)}
                              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded hover:border-orange-500 hover:text-orange-500 bg-white transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {/* サムネイルプレースホルダー */}
                              <div className="w-10 h-14 bg-gray-200 flex-shrink-0 rounded-sm overflow-hidden flex items-center justify-center text-gray-400">
                                {item.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                              </div>
                              <span className="text-slate-700 truncate max-w-[150px]">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500">
                            {item.type === 'image' ? '画像' : '動画'}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500">
                            {item.duration}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500 text-xs">
                            {item.size}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ページネーション */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2 text-sm text-slate-600">
                  <button className="p-1 text-gray-400 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-6 h-6 flex items-center justify-center bg-orange-500 text-white rounded font-medium">1</button>
                  <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded">2</button>
                  <button className="p-1 text-gray-400 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
                  <span className="ml-4">表示件数</span>
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-orange-500 outline-none">
                    <option>10件</option>
                    <option>20件</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 右カラム：選択済みメディア（プレイリスト） */}
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <div className="bg-gray-100 rounded-lg p-4 h-full border border-gray-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">選択済みメディア</h3>
                  <div className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    合計: {formatTime(totalDuration)}
                  </div>
                </div>

                {playlist.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg min-h-[300px]">
                    <p className="text-sm">メディアまたは広告枠を追加してください</p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[600px] pr-1">
                    {playlist.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`group relative flex items-center gap-3 p-3 rounded-lg border shadow-sm transition-all hover:shadow-md ${
                          item.isAd 
                            ? 'bg-orange-50 border-orange-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {/* ドラッグハンドル的なアイコン */}
                        <GripVertical className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0" />

                        {/* サムネイルエリア */}
                        <div className={`w-12 h-12 flex-shrink-0 rounded flex items-center justify-center ${
                          item.isAd ? 'bg-orange-100 text-orange-500' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {item.isAd ? (
                            <div className="text-center">
                              <span className="block text-[10px] font-bold">RAP</span>
                              <span className="block text-[10px]">{item.adDurationType}</span>
                            </div>
                          ) : item.type === 'image' ? (
                            <ImageIcon className="w-6 h-6" />
                          ) : (
                            <Video className="w-6 h-6" />
                          )}
                        </div>

                        {/* 情報エリア */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold truncate ${item.isAd ? 'text-orange-900' : 'text-slate-700'}`}>
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              item.isAd 
                                ? 'bg-orange-200 text-orange-800' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {item.isAd ? '広告枠' : (item.type === 'image' ? '画像' : '動画')}
                            </span>
                            <span>{item.duration}秒</span>
                          </div>
                        </div>

                        {/* 削除ボタン */}
                        <button 
                          onClick={() => removeFromPlaylist(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}