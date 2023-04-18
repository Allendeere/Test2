USE [PMI]
GO

/****** Object:  Table [dbo].[MHole]    Script Date: 2022/11/13 ¤W¤È 10:53:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MHole](
	[mh_MHoleNo] [int] IDENTITY(1,1) NOT NULL,
	[mh_PlatformID] [nvarchar](4) NULL,
	[mh_GroupID] [varchar](3) NULL,
	[mh_MHoleID] [varchar](9) NULL,
	[mh_MHoleSerial1] [nvarchar](20) NULL,
	[mh_MHoleSerial2] [nvarchar](20) NULL,
	[mh_MHoleSerial3] [nvarchar](20) NULL,
	[mh_MRatio] [nvarchar](3) NULL,
	[mh_MaterialNo] [int] NULL,
	[mh_IP1] [varchar](20) NULL,
	[mh_Port1] [int] NULL,
	[mh_IP2] [varchar](20) NULL,
	[mh_Port2] [int] NULL,
	[mh_Founder] [nvarchar](20) NULL,
	[mh_CreateDate] [datetime] NULL,
	[mh_Updater] [nvarchar](20) NULL,
	[mh_AlterDate] [datetime] NULL
) ON [PRIMARY]
GO


