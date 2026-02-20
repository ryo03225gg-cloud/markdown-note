import './MobileTabBar.css';

export default function MobileTabBar({ mobileTab, onTabChange }) {
  return (
    <div className="mobile-tab-bar">
      <button
        className={`mobile-tab-bar__tab ${mobileTab === 'edit' ? 'mobile-tab-bar__tab--active' : ''}`}
        onClick={() => onTabChange('edit')}
      >
        編集
      </button>
      <button
        className={`mobile-tab-bar__tab ${mobileTab === 'preview' ? 'mobile-tab-bar__tab--active' : ''}`}
        onClick={() => onTabChange('preview')}
      >
        プレビュー
      </button>
    </div>
  );
}
