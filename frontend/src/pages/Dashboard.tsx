import { useEffect, useState } from 'react';
import axios from '../api/axios';
import '../styles/Dashboard.css';

interface Url {
    id: number;
    originalUrl: string;
    shortUrl: string;
    slug: string;
    createdAt: string;
    totalClicks: number;
}

export default function Dashboard() {
    const [urlInput, setUrlInput] = useState('');
    const [urls, setUrls] = useState<Url[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedSlug, setEditedSlug] = useState<string>('');

    const fetchUrls = async () => {
        try {
            const res = await axios.get('/urls');
            setUrls(res.data);
        } catch (error) {
            alert('Failed to fetch URLs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlInput.trim()) return;

        try {
            const res = await axios.post('/url', { originalUrl: urlInput });
            setUrls([res.data, ...urls]);
            setUrlInput('');
        } catch (error) {
            alert('Failed to shorten URL');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleCopy = (shortUrl: string, id: number) => {
        navigator.clipboard.writeText(shortUrl).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const startEditing = (id: number, slug: string) => {
        setEditingId(id);
        setEditedSlug(slug);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditedSlug('');
    };
    const saveSlug = async (id: number) => {
        if (!editedSlug.trim()) {
            alert('Slug cannot be empty');
            return;
        }
        try {
            const res = await axios.patch(`/url/${id}`, { slug: editedSlug });
            setUrls((prevUrls) =>
                prevUrls.map((url) =>
                    url.id === id ? { ...url, slug: editedSlug, shortUrl: res.data.shortUrl } : url,
                ),
            );
            setEditingId(null);
            setEditedSlug('');
        } catch (error:any) {
            alert(
                Array.isArray(error?.response?.data?.message)
                    ? error.response.data.message[0]
                    : error?.response?.data?.message || 'Unknown error'
            );
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>URL Shortener Dashboard</h2>
                <button onClick={handleLogout} className="logout-button" aria-label="Logout">
                    Logout
                </button>
            </div>

            <form onSubmit={handleSubmit} className="url-form">
                <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter a long URL"
                    className="url-input"
                />
                <button type="submit" className="shorten-button">
                    Shorten
                </button>
            </form>

            <hr />

            {loading ? (
                <p>Loading your URLs...</p>
            ) : urls.length === 0 ? (
                <p>No URLs created yet.</p>
            ) : (
                <ul className="url-list">
                    {urls.map((url) => (
                        <li key={url.id} className="url-item">
                            <div>
                                <strong>Short:</strong>{' '}
                                <a
                                    href={url.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="url-short-link"
                                >
                                    {url.shortUrl}
                                </a>
                                <button
                                    className="copy-button"
                                    onClick={() => handleCopy(url.shortUrl, url.id)}
                                    aria-label="Copy short URL"
                                >
                                    {copiedId === url.id ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div>
                                <strong>Original:</strong> {url.originalUrl}
                            </div>
                            <div>
                                <strong>Slug:</strong>{' '}
                                {editingId === url.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedSlug}
                                            onChange={(e) => setEditedSlug(e.target.value)}
                                            className="slug-input"
                                        />
                                        <button onClick={() => saveSlug(url.id)} className="save-button">
                                            Save
                                        </button>
                                        <button onClick={cancelEditing} className="cancel-button">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="slug-text">{url.slug}</span>{' '}
                                        <button onClick={() => startEditing(url.id, url.slug)} className="edit-button">
                                            Edit
                                        </button>
                                    </>
                                )}
                            </div>
                            <div>
                                <strong>ClickCount:</strong> {url.totalClicks || 0}
                            </div>
                            <div className="url-created">
                                Created: {new Date(url.createdAt).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
